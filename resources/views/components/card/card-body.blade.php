{{-- resources/views/components/card/card-body.blade.php --}}
<div {{ $attributes->merge(['class' => 'card-body']) }}>
  {{ $slot }}
</div>
