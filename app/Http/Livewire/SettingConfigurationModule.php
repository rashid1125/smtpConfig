<?php

namespace App\Http\Livewire;

use App\Models\Items\ItemCalculationMethod;
use App\Models\Items\StockKeepingMethod;
use Livewire\Component;
use App\Models\SettingConfiguration;

/**
 * Class SettingConfigurationModule
 *
 * Livewire component for managing setting configurations.
 */
class SettingConfigurationModule extends Component
{
    /**
     * @var int $default_stock_keeping_method The default stock keeping method ID.
     */
    public int $default_stock_keeping_method;

    /**
     * @var int $default_rate_type The default rate type ID.
     */
    public int $default_rate_type;

    /**
     * @var bool $show_stock_keeping_method Flag to show or hide the stock keeping method.
     */
    public bool $show_stock_keeping_method;

    /**
     * @var bool $show_rate_type Flag to show or hide the rate type.
     */
    public bool $show_rate_type;

    /**
     * @var array $rules The validation rules for the component's properties.
     */
    protected array $rules
        = [
            'default_stock_keeping_method' => 'required|integer',
            'default_rate_type'            => 'required|integer',
            'show_stock_keeping_method'    => 'required|boolean',
            'show_rate_type'               => 'required|boolean',
        ];

    /**
     * Initialize the component and fill existing settings.
     *
     * @return void
     */
    public function mount(): void
    {
        $this->fillExistingSetting();
    }

    /**
     * Save the setting configuration.
     *
     * @return void
     */
    public function save(): void
    {
        $this->validate();
        SettingConfiguration::where('id', 1)->update($this->allProperties());
        session()->flash('message', 'Setting configuration saved successfully.');
    }

    /**
     * Handle updates to component properties.
     *
     * @param string $propertyName The name of the updated property.
     *
     * @return void
     */
    public function updated( string $propertyName ): void
    {
        $this->save();
    }

    /**
     * Fill the component properties with existing settings.
     *
     * @return void
     */
    public function fillExistingSetting(): void
    {
        $setting = SettingConfiguration::find(1);
        if ( $setting ) {
            $this->fill([
                'default_stock_keeping_method' => (int)$setting->default_stock_keeping_method,
                'default_rate_type'            => (int)$setting->default_rate_type,
                'show_stock_keeping_method'    => (bool)$setting->show_stock_keeping_method,
                'show_rate_type'               => (bool)$setting->show_rate_type,
            ]);
        }
    }

    /**
     * Get all component properties as an array.
     *
     * @return array The array of component properties.
     */
    protected function allProperties(): array
    {
        return [
            'default_stock_keeping_method' => $this->default_stock_keeping_method,
            'default_rate_type'            => $this->default_rate_type,
            'show_stock_keeping_method'    => $this->show_stock_keeping_method,
            'show_rate_type'               => $this->show_rate_type,
        ];
    }

    /**
     * Render the Livewire component view.
     *
     * @return \Illuminate\View\View The view for the component.
     */
    public function render(): \Illuminate\View\View
    {
        // Fetch the lists for the select inputs in the view
        $stockKeepingMethods = StockKeepingMethod::all();
        $rateTypes           = ItemCalculationMethod::all();

        return view('livewire.setting-configuration-module', [
            'stockKeepingMethods' => $stockKeepingMethods,
            'rateTypes'           => $rateTypes,
        ]);
    }
}
