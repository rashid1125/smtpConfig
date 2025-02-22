{{-- resources/views/components/modal/dynamic-modal-by-voucher-type.blade.php --}}
@props([
    'modalId',
    'modalTitle',
    'modalSize' => 'modal-xl',
    'tableId',
    'headers',
    'tableClass' => 'w-full',
])
<div class="modal fade modal-lookup" id="{{ $modalId }}" tabindex="-1" aria-labelledby="{{ $modalId }}Label"
    aria-hidden="true">
    <div class="modal-dialog {{ $modalSize }}">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="{{ $modalId }}Label">{{ $modalTitle }}</h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <x-table.dynamic-table id="{{ $tableId }}" class="table {{ $tableClass }}" :headers="$headers">
                </x-table.dynamic-table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
