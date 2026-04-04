<?php
/**
 * Render callback para el bloque apg-google-reviews.
 */

$place_id   = isset($attributes['placeId']) ? sanitize_text_field($attributes['placeId']) : '';
$api_key    = isset($attributes['apiKey']) ? sanitize_text_field($attributes['apiKey']) : '';
$cantidad   = isset($attributes['cantidad']) ? intval($attributes['cantidad']) : 4;
$unique_id  = isset($attributes['uniqueId']) ? sanitize_html_class($attributes['uniqueId']) : 'apg-google-reviews';

$is_demo = empty($place_id) && empty($api_key);

if ($is_demo) {
    $mock_data = include __DIR__ . '/mock-data.php';
    $reviews = array_slice($mock_data, 0, $cantidad);
} else {
    $api_url = add_query_arg([
        'place_id' => $place_id,
        'fields'   => 'reviews',
        'key'      => $api_key,
    ], 'https://maps.googleapis.com/maps/api/place/details/json');

    $response = wp_remote_get($api_url, ['timeout' => 15]);

    if (is_wp_error($response)) {
        echo '<div class="apg-google-reviews-error">Error: ' . esc_html($response->get_error_message()) . '</div>';
        return;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (!isset($data['result']['reviews']) || empty($data['result']['reviews'])) {
        echo '<div class="apg-google-reviews-error">No se encontraron reseñas.</div>';
        return;
    }

    $reviews = $data['result']['reviews'];
    usort($reviews, fn($a, $b) => $b['time'] - $a['time']);
    $reviews = array_slice($reviews, 0, $cantidad);
}
?>
<section class="apg-google-reviews-<?php echo esc_attr($unique_id); ?>">
    <ul class="apg-google-reviews-list">
        <?php foreach ($reviews as $review) : ?>
            <li class="apg-google-reviews-item">
                <div class="apg-google-reviews-author">
                    <?php if (!empty($review['profile_photo_url'])) : ?>
                        <img src="<?php echo esc_url($review['profile_photo_url']); ?>" alt="" class="apg-google-reviews-avatar">
                    <?php endif; ?>
                    <strong><?php echo esc_html($review['author_name']); ?></strong>
                    <span class="apg-google-reviews-rating">
                        <?php echo str_repeat('★', intval($review['rating'])) . str_repeat('☆', 5 - intval($review['rating'])); ?>
                    </span>
                </div>
                <p class="apg-google-reviews-text"><?php echo esc_html($review['text']); ?></p>
                <time class="apg-google-reviews-time"><?php echo esc_html($review['relative_time_description']); ?></time>
            </li>
        <?php endforeach; ?>
    </ul>
</section>
<style>
.apg-google-reviews-<?php echo esc_attr($unique_id); ?> {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 0 auto;
}
.apg-google-reviews-list { list-style: none; padding: 0; margin: 0; }
.apg-google-reviews-item {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
}
.apg-google-reviews-author { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.apg-google-reviews-avatar { width: 40px; height: 40px; border-radius: 50%; }
.apg-google-reviews-rating { color: #fbbf24; margin-left: auto; }
.apg-google-reviews-text { margin: 0 0 10px 0; line-height: 1.6; }
.apg-google-reviews-time { font-size: 0.85em; color: #666; }
.apg-google-reviews-error {
    padding: 20px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    text-align: center;
}
</style>
