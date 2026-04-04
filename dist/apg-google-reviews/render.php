<?php
/**
 * Render callback para el bloque apg-google-reviews.
 */

$place_id   = isset( $attributes['placeId'] ) ? sanitize_text_field( $attributes['placeId'] ) : '';
$api_key    = isset( $attributes['apiKey'] ) ? sanitize_text_field( $attributes['apiKey'] ) : '';
$cantidad   = isset( $attributes['cantidad'] ) ? intval( $attributes['cantidad'] ) : 4;
$unique_id  = isset( $attributes['uniqueID'] ) ? sanitize_html_class( $attributes['uniqueID'] ) : 'apg-gr-' . substr( uniqid(), -6 );

$is_demo = empty( $place_id ) && empty( $api_key );

if ( $is_demo ) {
    $mock_data = include __DIR__ . '/mock-data.php';
    $reviews = array_slice( $mock_data, 0, $cantidad );
} else {
    $api_url = add_query_arg(
        [
            'place_id' => $place_id,
            'fields'   => 'reviews',
            'key'      => $api_key,
        ],
        'https://maps.googleapis.com/maps/api/place/details/json'
    );

    $response = wp_remote_get( $api_url, [ 'timeout' => 15 ] );

    if ( is_wp_error( $response ) ) {
        echo '<div class="apg-google-reviews-error">Error: ' . esc_html( $response->get_error_message() ) . '</div>';
        return;
    }

    $data = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( ! isset( $data['result']['reviews'] ) || empty( $data['result']['reviews'] ) ) {
        echo '<div class="apg-google-reviews-error">' . esc_html__( 'No se encontraron reseñas.', 'apg-google-reviews' ) . '</div>';
        return;
    }

    $reviews = $data['result']['reviews'];
    usort( $reviews, fn( $a, $b ) => $b['time'] - $a['time'] );
    $reviews = array_slice( $reviews, 0, $cantidad );
}
?>
<section class="apg-google-reviews-<?php echo esc_attr( $unique_id ); ?>">
    <ul class="apg-google-reviews-list">
        <?php
        foreach ( $reviews as $review ) :
            $rating = isset( $review['rating'] ) ? intval( $review['rating'] ) : 5;
            $author_name = isset( $review['author_name'] ) ? esc_html( $review['author_name'] ) : '';
            $text = isset( $review['text'] ) ? esc_html( $review['text'] ) : '';
            $time_desc = isset( $review['relative_time_description'] ) ? esc_html( $review['relative_time_description'] ) : '';
            $avatar_url = isset( $review['profile_photo_url'] ) ? esc_url( $review['profile_photo_url'] ) : '';
            ?>
            <li class="apg-google-reviews-card">
                <div class="apg-google-reviews-header">
                    <?php if ( ! empty( $avatar_url ) ) : ?>
                        <img src="<?php echo $avatar_url; ?>" alt="" class="apg-google-reviews-avatar">
                    <?php endif; ?>
                    <div class="apg-google-reviews-meta">
                        <strong class="apg-google-reviews-name"><?php echo $author_name; ?></strong>
                        <div class="apg-google-reviews-rating">
                            <?php
                            for ( $i = 0; $i < 5; $i++ ) {
                                echo $i < $rating ? '★' : '☆';
                            }
                            ?>
                        </div>
                    </div>
                </div>
                <p class="apg-google-reviews-text">"<?php echo $text; ?>"</p>
                <time class="apg-google-reviews-time"><?php echo $time_desc; ?></time>
            </li>
        <?php endforeach; ?>
    </ul>
</section>
