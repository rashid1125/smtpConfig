{{-- resources/views/components/input-field.blade.php --}}
<div class="form-group">
  <x-label :for="$name">{{ $label }}</x-label>
  <x-input :type="$type" :name="$name" :id="$name" :placeholder="$placeholder" :data-toggle='tooltip' :data-title='$toggleTitle' :value="$value" />
</div>