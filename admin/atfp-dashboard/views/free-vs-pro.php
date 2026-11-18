<?php
if(!defined('ABSPATH')){
    exit;
}
?>
<div class="atfp-dashboard-free-vs-pro">
    <div class="atfp-dashboard-free-vs-pro-container">
    <div class="header">
        <h1><?php esc_html_e('Free VS Pro', 'automatic-translations-for-polylang'); ?></h1>
        <?php
        $atfp_utm_parameters='utm_source=atfp_plugin';
        if(class_exists('ATFP_Helper')){
            $atfp_utm_parameters=ATFP_Helper::utm_source_text();
        }
        $atfp_buy_pro_url=esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=dashboard_free_vs_pro');
        ?>
        <a href="<?php echo esc_url($atfp_buy_pro_url); ?>" class="atfp-dashboard-btn primary" target="_blank"><?php esc_html_e('Buy Pro', 'automatic-translations-for-polylang'); ?></a>
    </div>

    <p><?php echo esc_html(__('Compare the Free and Pro versions to choose the best option for your translation needs.', 'automatic-translations-for-polylang')); ?></p>

    <table>
        <thead>
            <tr>
                <th><?php echo esc_html(__('Features', 'automatic-translations-for-polylang')); ?></th>
                <th><?php echo esc_html(__('Free', 'automatic-translations-for-polylang')); ?></th>
                <th><?php echo esc_html(__('Pro', 'automatic-translations-for-polylang')); ?></th>
            </tr>
        </thead>
        <tbody>
			<?php
				$atfp_features = array(
					array(
						sprintf(
							/* translators: %s: Google Translate (brand name, not translated) */
							__( '%s Widget Support', 'automatic-translations-for-polylang' ),
							'Google Translate'
						),
						true,
						true,
					),
					array(
						sprintf(
							/* translators: %s: Yandex Translate (brand name, not translated) */
							__( '%s Widget Support', 'automatic-translations-for-polylang' ),
							'Yandex Translate'
						),
						true,
						true,
					),
					array(
						sprintf(
							/* translators: 1: Chrome (brand name, not translated), 2: AI (not translated) */
							__( '%1$s Built-in %2$s Support', 'automatic-translations-for-polylang' ),
							'Chrome',
							'AI'
						),
						true,
						true,
					),
					array(
						sprintf(
							/* translators: 1: Edge (brand name, not translated), 2: AI (not translated) */
							__( '%1$s Built-in %2$s Support', 'automatic-translations-for-polylang' ),
							'Edge',
							'AI'
						),
						true,
						true,
					),
					array(
						sprintf(
							/* translators: %s: API Key (not translated) */
							__( 'No %s Required', 'automatic-translations-for-polylang' ),
							'API Key'
						),
						true,
						true,
					),
					array( __( 'Unlimited Translations', 'automatic-translations-for-polylang' ), true, true ),
					array(
						sprintf(
							/* translators: 1: AI (not translated), 2: Gemini/OpenAI/DeepL (brand names, not translated) */
							__( '%1$s Translator (%2$s) Support', 'automatic-translations-for-polylang' ),
							'AI',
							'Gemini/OpenAI/DeepL'
						),
						false,
						true,
					),
					array( __( 'Custom Fields Translation', 'automatic-translations-for-polylang' ), false, true ),
					array( __( 'Taxonomy Translation', 'automatic-translations-for-polylang' ), false, true ),
					array( __( 'Bulk Translation', 'automatic-translations-for-polylang' ), false, true ),
					array( __( 'Re Translation', 'automatic-translations-for-polylang' ), false, true ),
					array(
						sprintf(
							/* translators: %s: Classic Editor (brand name, not translated) */
							__( '%s Translation', 'automatic-translations-for-polylang' ),
							'Classic Editor'
						),
						false,
						true,
					),
					array(
						sprintf(
							/* translators: %s: Divi 5 (brand name, not translated) */
							__( '%s Translation', 'automatic-translations-for-polylang' ),
							'Divi 5'
						),
						false,
						true,
					),
					array( __( 'Premium Support', 'automatic-translations-for-polylang' ), false, true ),
				);
				foreach ( $atfp_features as $atfp_availability ) :
					?>
				<tr>
					<td><?php echo esc_html( $atfp_availability[0] ); ?></td>
					<td class="<?php echo $atfp_availability[1] ? 'check' : 'cross'; ?>">
						<?php echo $atfp_availability[1] ? '✓' : '✗'; ?>
					</td>
					<td class="<?php echo $atfp_availability[2] ? 'check' : 'cross'; ?>">
						<?php echo $atfp_availability[2] ? '✓' : '✗'; ?>
					</td>
				</tr>
				<?php endforeach; ?>
        </tbody>
    </table>
    </div>
	<?php require_once ATFP_DIR_PATH . 'admin/atfp-dashboard/views/footer.php'; ?>
</div>