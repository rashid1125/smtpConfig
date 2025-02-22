@extends('layouts.app')

@section('content')


    <section class="bg-gray-50 dark:bg-gray-900 shadow">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="{{ asset('assets/img/dm.png') }}" alt="logo">
                <b>Digital</b>Manager
            </a>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {{ __('Reset Password') }}
                    </h1>
                    <form class="space-y-4 md:space-y-6" method="POST" action="{{ route('password.update') }}">
                        @csrf
                        <input type="hidden" name="token" value="{{ request()->token }}">

                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                {{ __('E-Mail Address') }}</label>
                            <input id="email" type="email" class="form-input-class @error('email') is-invalid @enderror" name="email" value="{{ $email ?? old('email') }}" placeholder="E-Mail or Username" required autocomplete="email" autofocus>

                            @error('email')
                                <p class="text-md font-weight-bold text-red-500">{{ $message }}</p>
                            @enderror
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ __('Password') }}</label>
                            <input id="password" type="password" class="form-input-class @error('password') is-invalid @enderror" name="password" required autocomplete="new-password" pattern="^(?=.*[A-Za-z])(?=.*[!@#$%^&*_]).{8,}$" title="Password must be 8 characters long and include at least one special character">
                            @error('password')
                                <p class="text-md font-weight-bold text-red-500">{{ $message }}</p>
                            @enderror
                        </div>
                        <div>
                            <label for="password-confirm" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ __('Confirm Password') }}</label>
                            <input id="password-confirm" type="password" class="form-input-class" name="password_confirmation" required autocomplete="new-password">

                        </div>
                        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ __('Reset Password') }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
@endsection

