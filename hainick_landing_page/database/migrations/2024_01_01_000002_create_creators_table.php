<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creators', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('profile_image')->nullable();
            $table->unsignedBigInteger('followers_tiktok')->default(0);
            $table->unsignedBigInteger('followers_instagram')->default(0);
            $table->unsignedBigInteger('followers_x')->default(0);
            $table->string('url_instagram')->nullable();
            $table->string('url_tiktok')->nullable();
            $table->string('url_x')->nullable();
            // Original Node app used a MySQL SET() column for roles.
            // A plain string column is used here for portability; a
            // comma-separated list of roles is stored, same as before.
            $table->string('roles')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creators');
    }
};
