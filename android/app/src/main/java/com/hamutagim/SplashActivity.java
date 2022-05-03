package com.TimerAppRN;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.TimerAppRN.MainActivity;
import com.TimerAppRN.R;


/**
 * Created by ofekcohen on 28.5.2018.
 */

public class SplashActivity extends Activity implements Runnable
{
    Thread thread;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        //Intent intent = new Intent(this, MainActivity.class);
        //startActivity(intent);
        //finish();
        thread = new Thread(this);

        thread.start();
    }

    @Override
    public void run(){
        try {
            Thread.sleep(5000);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            startActivity(new Intent(getApplicationContext(), MainActivity.class));
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
            finish();
        }
    }
}
