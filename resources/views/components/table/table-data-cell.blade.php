{{-- resources/views/components/table/table-data-cell.blade.php --}}

<td {{ $attributes->merge(['class' => 'py-2 px-2 text-md align-middle']) }}>
  {{ $slot }}
</td>
