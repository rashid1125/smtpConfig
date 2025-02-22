{{-- resources/views/components/tab-pane.blade.php --}}
<div class="tab-pane {{ $active ?? false ? 'active' : '' }}" id="{{ $id }}">
    {{ $slot }}
</div>
