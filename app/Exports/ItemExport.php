<?php

namespace App\Exports;

use App\Models\Items\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Events\AfterSheet;

class ItemExport implements FromCollection, WithEvents
{
    use Exportable, RegistersEventListeners;


    /**
     * @return array
     */
    protected $headings =  [
        'Category',
        'Sub Category',
        'Bar Code',
        'Name',
        'Native Name',
        'Item Type',
        'Warehouse',
        'Stock Keeping',
        'Calculation Type',
        'Purchase Price',
        'Retail Price',
        'Whole Sale Price',
        'Tax Ratio',
        'Available Qty',
        'Cost',
    ];

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $items = Item::with([
            'itemCategory',
            'itemSubCategory',
            'itemBrand',
            'itemMade',
            'itemInventoryAccount',
            'itemCostAccount',
            'itemIncomeAccount',
            'stockKeepingMethod',
            'itemCalculationMethod'
        ])->get();
        // Transform the items as needed
        $counter = 1; // Initialize counter
        $transformedItems = collect(); // Create a new collection

        $items->each(function ($item) use (&$counter, &$transformedItems) {
            $transformedItems->push([
                'Category' => optional($item->itemCategory)->name,
                'Sub Category' => optional($item->itemSubCategory)->name,
                'Bar Code' => $item->barcode,
                'Name' => $item->item_des,
                'Native Name' => $item->uname,
                'Item Type' => (int)($item->item_type) === 0 ? 'Inventory' : 'Service',
                'Warehouse' => optional($item->warehouse)->name,
                'Stock Keeping' => optional($item->stockKeepingMethod)->name,
                'Calculation Type' => optional($item->itemCalculationMethod)->name,
                'Purchase Price' => $item->cost_price,
                'Retail Price' => $item->srate,
                'Whole Sale Price' => $item->srate1,
                'Tax Ratio' => $item->taxrate,
                'Available Qty' => "0.00",
                'Cost' => "0.00",
            ]);
        });

        return $transformedItems;
    }


    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getParent()->getActiveSheet();
                $event->sheet->getStyle('A1:P1')->getFont()->setBold(true);
                $event->sheet->setAutoFilter('A1:P1');
                // Use prepend on the collection to add headings at the top
                $event->sheet->getDelegate()->fromArray([$this->headings], null, 'A1');
            },
        ];
    }
}
