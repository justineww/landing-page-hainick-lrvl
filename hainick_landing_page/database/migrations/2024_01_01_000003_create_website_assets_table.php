<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_assets', function (Blueprint $table) {
            $table->id();
            $table->string('image_type')->unique();
            $table->string('image_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_assets');
    }
};
