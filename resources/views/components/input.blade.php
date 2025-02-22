{{-- resources/views/components/input.blade.php --}}
<input {{ $attributes->merge(['class' => 'form-control form-input-class']) }} data-toggle="tooltip"
    title="{{ isset($title) ? $title : '' }}" />
