<?php

namespace App\Http\Livewire;

use Livewire\Component;

/**
 * Summary of FreightTypeDropdown
 */
class FreightTypeDropdown extends Component
{
    /**
     * Summary of options
     * @var
     */
    public $options;
    /**
     * Summary of isSale
     * @var
     */
    public $isSale;
    /**
     * Summary of selected
     * @var
     */
    public $selected;
    public $isSaleReturn;
    /**
     * Summary of mount
     * @param mixed $options
     * @param mixed $selected
     * @param mixed $isSaleReturn
     * @param mixed $isSale
     * @return void
     */
    public function mount($options = '0', $isSaleReturn  = false, $selected = null, $isSale = false)
    {
        $this->isSaleReturn  = $isSaleReturn;
        $this->options     = explode(',', $options);
        $this->selected    = $selected;
        $this->isSale      = $isSale;
    }
    /**
     * Summary of render
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('livewire.freight-type-dropdown');
    }
}
