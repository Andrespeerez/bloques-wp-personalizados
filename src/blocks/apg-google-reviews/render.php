<?php
/**
 * Render callback para el bloque apg-google-reviews.
 */

if ( ! function_exists( 'apg_generate_block_css' ) ) {
function apg_generate_block_css( $unique_id, $attributes ) {
    $defaults = array(
        'cardBackgroundColor'    => '#ffffff',
        'cardTextColor'          => '#1a1a1a',
        'cardBorderRadius'        => 12,
        'cardBorderRadiusTablet'  => 12,
        'cardBorderRadiusMobile'  => 12,
        'cardPaddingDesktop'      => array( 20, 20, 20, 20 ),
        'cardPaddingTablet'       => array( 16, 16, 16, 16 ),
        'cardPaddingMobile'       => array( 16, 16, 16, 16 ),
        'cardBorderWidth'         => 0,
        'cardBorderColor'         => '#e5e5e5',
        'avatarSize'              => 48,
        'avatarBorderRadius'      => 50,
        'nameFontSize'            => 16,
        'nameFontWeight'          => '600',
        'textFontSize'            => 14,
        'textLineHeight'          => 1.6,
        'timeFontSize'            => 12,
        'starColor'               => '#fbbf24',
        'starEmptyColor'          => '#d1d5db',
        'gapDesktop'              => 20,
        'gapTablet'               => 16,
        'gapMobile'               => 12,
        'layout'                  => 'list',
        'columnsDesktop'         => 2,
        'columnsTablet'           => 1,
        'columnsMobile'           => 1,
    );

    $atts = array_merge( $defaults, array_intersect_key( $attributes, $defaults ) );

    $css = ".apg-google-reviews-{$unique_id} {\n";
    $css .= "    --apg-card-bg: {$atts['cardBackgroundColor']};\n";
    $css .= "    --apg-card-text: {$atts['cardTextColor']};\n";
    $css .= "    --apg-card-radius: {$atts['cardBorderRadius']}px;\n";
    $css .= "    --apg-card-radius-tablet: {$atts['cardBorderRadiusTablet']}px;\n";
    $css .= "    --apg-card-radius-mobile: {$atts['cardBorderRadiusMobile']}px;\n";
    $css .= "    --apg-card-padding: {$atts['cardPaddingDesktop'][0]}px {$atts['cardPaddingDesktop'][1]}px {$atts['cardPaddingDesktop'][2]}px {$atts['cardPaddingDesktop'][3]}px;\n";
    $css .= "    --apg-card-border-width: {$atts['cardBorderWidth']}px;\n";
    $css .= "    --apg-card-border-color: {$atts['cardBorderColor']};\n";
    $css .= "    --apg-avatar-size: {$atts['avatarSize']}px;\n";
    $css .= "    --apg-avatar-radius: {$atts['avatarBorderRadius']}%;\n";
    $css .= "    --apg-name-size: {$atts['nameFontSize']}px;\n";
    $css .= "    --apg-name-weight: {$atts['nameFontWeight']};\n";
    $css .= "    --apg-text-size: {$atts['textFontSize']}px;\n";
    $css .= "    --apg-text-line-height: {$atts['textLineHeight']};\n";
    $css .= "    --apg-time-size: {$atts['timeFontSize']}px;\n";
    $css .= "    --apg-star-color: {$atts['starColor']};\n";
    $css .= "    --apg-star-empty: {$atts['starEmptyColor']};\n";
    $css .= "    --apg-gap: {$atts['gapDesktop']}px;\n";
    $css .= "}\n\n";

    if ( $atts['layout'] === 'grid' ) {
        $css .= ".apg-google-reviews-{$unique_id} .apg-google-reviews-list {\n";
        $css .= "    display: grid;\n";
        $css .= "    grid-template-columns: repeat({$atts['columnsDesktop']}, 1fr);\n";
        $css .= "    gap: var(--apg-gap);\n";
        $css .= "}\n\n";
    } else {
        $css .= ".apg-google-reviews-{$unique_id} .apg-google-reviews-list {\n";
        $css .= "    display: flex;\n";
        $css .= "    flex-direction: column;\n";
        $css .= "    gap: var(--apg-gap);\n";
        $css .= "}\n";
    }

    $css .= "\n@media (max-width: 1024px) {\n";
    $css .= "    .apg-google-reviews-{$unique_id} .apg-google-reviews-card {\n";
    $css .= "        border-radius: var(--apg-card-radius-tablet);\n";
    $css .= "        padding: {$atts['cardPaddingTablet'][0]}px {$atts['cardPaddingTablet'][1]}px {$atts['cardPaddingTablet'][2]}px {$atts['cardPaddingTablet'][3]}px;\n";
    if ( $atts['layout'] === 'grid' ) {
        $css .= "    }\n";
        $css .= "    .apg-google-reviews-{$unique_id} .apg-google-reviews-list {\n";
        $css .= "        grid-template-columns: repeat({$atts['columnsTablet']}, 1fr);\n";
        $css .= "        gap: {$atts['gapTablet']}px;\n";
    }
    $css .= "    }\n";
    $css .= "}\n\n";

    $css .= "@media (max-width: 767px) {\n";
    $css .= "    .apg-google-reviews-{$unique_id} .apg-google-reviews-card {\n";
    $css .= "        border-radius: var(--apg-card-radius-mobile);\n";
    $css .= "        padding: {$atts['cardPaddingMobile'][0]}px {$atts['cardPaddingMobile'][1]}px {$atts['cardPaddingMobile'][2]}px {$atts['cardPaddingMobile'][3]}px;\n";
    if ( $atts['layout'] === 'grid' ) {
        $css .= "    }\n";
        $css .= "    .apg-google-reviews-{$unique_id} .apg-google-reviews-list {\n";
        $css .= "        grid-template-columns: repeat({$atts['columnsMobile']}, 1fr);\n";
        $css .= "        gap: {$atts['gapMobile']}px;\n";
    }
    $css .= "    }\n";
    $css .= "}\n";

    return $css;
}
}

$place_id   = isset( $attributes['placeId'] ) ? sanitize_text_field( $attributes['placeId'] ) : '';
$api_key    = isset( $attributes['apiKey'] ) ? sanitize_text_field( $attributes['apiKey'] ) : '';
$cantidad   = isset( $attributes['cantidad'] ) ? intval( $attributes['cantidad'] ) : 4;
$unique_id  = isset( $attributes['uniqueID'] ) ? sanitize_html_class( $attributes['uniqueID'] ) : 'apg-gr-' . substr( uniqid(), -6 );

$is_demo = empty( $place_id ) && empty( $api_key );

if ( $is_demo ) {
    $mock_data = include __DIR__ . '/mock-data.php';
    $reviews = array_slice( $mock_data, 0, $cantidad );
} else {
    $cache_key = 'apg_gr_cache_' . md5( $place_id . $api_key . $cantidad );
    $cached_reviews = get_transient( $cache_key );

    if ( false === $cached_reviews ) {
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

        $cached_reviews = $data['result']['reviews'];
        usort( $cached_reviews, fn( $a, $b ) => $b['time'] - $a['time'] );

        set_transient( $cache_key, $cached_reviews, DAY_IN_SECONDS );
    }

    $reviews = array_slice( $cached_reviews, 0, $cantidad );
}

$block_css = apg_generate_block_css( $unique_id, $attributes );
$custom_css = isset( $attributes['customCSS'] ) ? $attributes['customCSS'] : '';
$full_css = $block_css . $custom_css;
?>
<?php if ( $full_css ) : ?>
<style><?php echo $full_css; ?></style>
<?php endif; ?>
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
