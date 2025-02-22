@extends('layouts.app')
@section('content')
    <section class="bg-gray-50 dark:bg-gray-900 shadow">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="{{ asset('assets/img/dm.png') }}" alt="logo">
                <b>SR</b>Manager
            </a>
            <div
                    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {{ __('Login') }}
                    </h1>
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <form class="space-y-4 md:space-y-6" method="POST" action="{{ route('login') }}">
                        @if ($errors->has('login_error'))
                            <div class="bg-red-500 text-white py-2 px-4 rounded-md inline-block mr-2">
                                @foreach ($errors->get('login_error') as $error)
                                    {!! $error !!}
                                @endforeach
                            </div>
                        @endif
                        @csrf
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                {{ __('E-Mail Or Username') }}</label>
                            <input type="text" name="email" id="email"
                                   class="form-input-class @error('email') border-red-500 @enderror"
                                   placeholder="E-Mail or Username" value="{{ old('email') }}" autocomplete="email" autofocus>
                            @error('email')
                            <p class="text-md font-weight-bold text-red-500">{{ $message }}</p>
                            @enderror
                        </div>
                        <div>
                            <label for="password"
                                   class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ __('Password') }}</label>
                            <input type="password" name="password" id="password" placeholder="Password"
                                   class="form-input-class @error('password') border-red-500 @enderror"
                                   value="{{ old('password') }}" required>
                            @error('password')
                            <p class="text-2xl font-weight-bold text-red-500">{{ $message }}</p>
                            @enderror
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" name="remember"
                                           class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            {{ old('remember') ? 'checked' : '' }}>
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember"
                                           class="text-gray-500 dark:text-gray-300">{{ __('Remember Me') }}</label>
                                </div>
                            </div>
                            @if (Route::has('password.request'))
                                <a href="{{ route('password.request') }}"
                                   class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">{{ __('Forgot Your Password?') }}</a>
                            @endif
                        </div>
                        <button type="submit"
                                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ __('Login') }}</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
@endsection
