package com.fitnessevo;
import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtras(getIntent().getExtras());  // Pass along FCM messages/notifications etc.
        startActivity(intent);
        finish();
    }
}