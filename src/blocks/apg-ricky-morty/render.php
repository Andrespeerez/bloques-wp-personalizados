<?php
/**
 * Render callback para el bloque de apg-ricky-morty
 */

if ( !function_exists('apg_rm_generate_block_css')) {
    function apg_rm_generate_block_css($unique_id, $attributes) {
        $defaults = array(
            'cardBackgroundColor' => '#fafafa',
            'padding' => 20,
            'borderRadius' => 12,
        );

        $atts = array_merge($defaults, array_intersect_key($attributes, $defaults));

        $css = ".apg-ricky-morty-{$unique_id} {\n";
        $css .= "    --card-bg: {$atts['cardBackgroundColor']};\n";
        $css .= "    --card-padding: {$atts['padding']}px;\n";
        $css .= "    --card-radius: {$atts['borderRadius']}px;\n";
        $css .= "}\n\n";

        return $css;
    }
}

$unique_id = isset($attributes['uniqueID']) ? sanitize_html_class($attributes['uniqueID']) : 'apg-ricky-morty-' . substr(uniqid(), -6);
$cantidad = isset($attributes['cantidad']) ? intval($attributes['cantidad']) : 4;

$cache_key = 'apg_ricky_morty_cache_' . md5($cantidad);
$cached_rickies = get_transient($cache_key);

if ( false === $cached_rickies ) {
    $api_url = "https://rickandmortyapi.com/api/character/?limit=20";

    $response = wp_remote_get($api_url, array('timeout' => 15));

    if ( is_wp_error($response) ) {
        echo '<div class="apg-ricky-morty-error">Error: ' . esc_html($response->get_error_message()) . '</div>';
        return;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if ( ! isset($data['results']) || empty($data['results']) ) {
        echo '<div class="apg-ricky-morty-error">' . esc_html__('No se encontraron personajes.', 'apg-ricky-morty') . '</div>';
        return;
    }

    $cached_rickies = $data['results'];

    set_transient($cache_key, $cached_rickies, DAY_IN_SECONDS);
}

$rickies = array_slice($cached_rickies, 0, $cantidad);

$block_css = apg_rm_generate_block_css($unique_id, $attributes);
$custom_css = isset($attributes['customCSS']) ? $attributes['customCSS'] : '';
$full_css = $block_css . $custom_css;
?>
<?php if ($full_css): ?>
<style><?php echo $full_css; ?></style>
<?php endif; ?>

<div class="apg-ricky-morty-<?php echo esc_attr($unique_id); ?>">
    <ul class="apg-ricky-morty-list">
        <?php foreach($rickies as $ricky): 
            $nombre = esc_html($ricky['name']);
            $status = esc_html($ricky['status']);
            $species = esc_html($ricky['species']);
            $gender = esc_html($ricky['gender']);
            $image = esc_attr($ricky['image']);
            $status_color = ($status === 'Alive') ? '#4caf50' : ($status === 'Dead' ? '#f44336' : '#9e9e9e');
        ?>
        <li class="apg-ricky-morty-card">
            <div class="apg-ricky-morty-header">
                <img src="<?php echo $image; ?>" alt="<?php echo $nombre; ?>">
                <h3><?php echo $nombre; ?></h3>
            </div>
            <div class="apg-ricky-morty-info">
                <span class="apg-ricky-morty-status" style="color: <?php echo esc_attr($status_color); ?>">
                    <?php echo $status; ?>
                </span>
                <span class="apg-ricky-morty-species"><?php echo $species; ?></span>
                <span class="apg-ricky-morty-gender"><?php echo $gender; ?></span>
            </div>
        </li>
        <?php endforeach; ?>
    </ul>
</div>
