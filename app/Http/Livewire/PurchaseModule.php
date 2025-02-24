<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Models\PurchaseModuleSetting;

/**
 * Class PurchaseModule
 *
 * Livewire component for managing purchase module settings.
 */
class PurchaseModule extends Component
{
    /**
     * @var array $purchaseModuleSettings The settings for the purchase module.
     */
    public array $purchaseModuleSettings = [];

    /**
     * @var int $grid_type The type of grid used in the purchase module.
     */
    public int $grid_type;

    /**
     * @var bool $show_other_information Flag to show or hide other information.
     */
    public bool $show_other_information;

    /**
     * @var bool $show_stock_information Flag to show or hide stock information.
     */
    public bool $show_stock_information;

    /**
     * @var bool $show_last_5_purchase_rate Flag to show or hide the last 5 purchase rates.
     */
    public bool $show_last_5_purchase_rate;

    /**
     * @var bool $show_account_information Flag to show or hide account information.
     */
    public bool $show_account_information;

    /**
     * @var bool $show_item_information Flag to show or hide item information.
     */
    public bool $show_item_information;

    /**
     * @var bool $show_item_stock_keeping_type Flag to show or hide item stock keeping type.
     */
    public bool $show_item_stock_keeping_type;

    /**
     * @var bool $grid_rate_type The rate type of the grid.
     */
    public bool $grid_rate_type;

    /**
     * @var int $further_tax The further tax applied.
     */
    public int $further_tax;

    /**
     * @var int $stock_keeping_method_id The ID of the stock keeping method.
     */
    public int $stock_keeping_method_id;

    /**
     * @var array $rules The validation rules for the component's properties.
     */
    protected array $rules
        = [
            'show_other_information'       => 'required|boolean',
            'show_stock_information'       => 'required|boolean',
            'show_last_5_purchase_rate'    => 'required|boolean',
            'show_account_information'     => 'required|boolean',
            'show_item_information'        => 'required|boolean',
            'show_item_stock_keeping_type' => 'required|boolean',
            'grid_rate_type'               => 'required|boolean',
            'stock_keeping_method_id'      => 'required|exists:stock_keeping_methods,id',
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
     * Save the purchase module settings.
     *
     * @return void
     */
    public function save(): void
    {
        $this->validate();
        PurchaseModuleSetting::where('id', 1)->update($this->allProperties());
        session()->flash('message', 'Purchase module settings saved successfully.');
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
        if ( $propertyName === 'show_other_information' && !$this->show_other_information ) {
            $this->show_stock_information       = false;
            $this->show_last_5_purchase_rate    = false;
            $this->show_account_information     = false;
            $this->show_item_information        = false;
            $this->show_item_stock_keeping_type = false;
        }

        // If any of the related fields are set to true, ensure show_other_information is true
        if (
            $this->show_stock_information ||
            $this->show_last_5_purchase_rate ||
            $this->show_account_information ||
            $this->show_item_information ||
            $this->show_item_stock_keeping_type
        ) {
            $this->show_other_information = true;
        }

        $this->save();
    }

    /**
     * Fill the component properties with existing settings.
     *
     * @return void
     */
    public function fillExistingSetting(): void
    {
        $setting = PurchaseModuleSetting::find(1);
        if ( $setting ) {
            $this->fill([
                'grid_type'                    => (int)$setting->grid_type,
                'show_other_information'       => (bool)$setting->show_other_information,
                'show_stock_information'       => (bool)$setting->show_stock_information,
                'show_last_5_purchase_rate'    => (bool)$setting->show_last_5_purchase_rate,
                'show_account_information'     => (bool)$setting->show_account_information,
                'show_item_information'        => (bool)$setting->show_item_information,
                'show_item_stock_keeping_type' => (bool)$setting->show_item_stock_keeping_type,
                'grid_rate_type'               => (bool)$setting->grid_rate_type,
                'further_tax'                  => (bool)$setting->further_tax,
                'stock_keeping_method_id'      => (int)$setting->stock_keeping_method_id,
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
            'grid_type'                    => $this->grid_type,
            'show_other_information'       => $this->show_other_information,
            'show_stock_information'       => $this->show_stock_information,
            'show_last_5_purchase_rate'    => $this->show_last_5_purchase_rate,
            'show_account_information'     => $this->show_account_information,
            'show_item_information'        => $this->show_item_information,
            'show_item_stock_keeping_type' => $this->show_item_stock_keeping_type,
            'grid_rate_type'               => $this->grid_rate_type,
            'further_tax'                  => $this->further_tax,
            'stock_keeping_method_id'      => $this->stock_keeping_method_id,
        ];
    }

    /**
     * Render the Livewire component view.
     *
     * @return \Illuminate\View\View The view for the component.
     */
    public function render(): \Illuminate\View\View
    {
        return view('livewire.purchase-module');
    }
}