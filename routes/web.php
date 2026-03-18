<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Cover')->name('home');
Route::inertia('v1', 'CalamigoV3')->name('proposal.v1');
Route::inertia('designs', 'DesignPlayground')->name('designs');
Route::inertia('moodboard/motion', 'MoodboardMotion')->name('moodboard.motion');
Route::inertia('moodboard/fonts', 'MoodboardFonts')->name('moodboard.fonts');
Route::inertia('moodboard/scrollytelling', 'MoodboardScrollytelling')->name('moodboard.scrollytelling');
Route::inertia('moodboard/animations', 'MoodboardDesignAnimations')->name('moodboard.animations');
Route::inertia('moodboard/vocabulary', 'DesignVocabulary')->name('moodboard.vocabulary');
Route::inertia('moodboard/easing', 'EasingCurves')->name('moodboard.easing');
Route::inertia('moodboard/color', 'ColorAtmosphere')->name('moodboard.color');
Route::inertia('moodboard/scrollcraft', 'ScrollCraft')->name('moodboard.scrollcraft');
Route::inertia('moodboard/snapflow', 'SnapFlow')->name('moodboard.snapflow');
Route::inertia('v2', 'CalamigoV2')->name('proposal.v2');
Route::inertia('v3', 'Calamigos')->name('proposal.v3');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
