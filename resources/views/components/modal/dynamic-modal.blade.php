{{-- resources/views/components/modal/dynamic-modal.blade.php --}}
<div class="modal fade" id="{{ $modalId }}"  aria-labelledby="dynamicModalLabel" aria-hidden="true">
    <div class="modal-dialog {{ $modalSize }}">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="dynamicModalLabel">{{ $title }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                {{ $slot }}
            </div>
            @if (isset($footer))
                <div class="modal-footer">
                    {{ $footer }}
                </div>
            @endif
        </div>
    </div>
</div>
