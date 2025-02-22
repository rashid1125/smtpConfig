{{-- resources/views/components/card/card-header.blade.php --}}
<div {{ $attributes->merge(['class' => 'card-header']) }}>
  {{ $slot }}
</div>
