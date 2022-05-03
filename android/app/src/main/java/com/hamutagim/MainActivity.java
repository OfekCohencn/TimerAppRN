package com.TimerAppRN;
import android.os.Bundle; // here
import android.content.Intent;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
       @Override
    protected void onCreate(Bundle savedInstanceState)
    {
		//SplashScreen.show(this); 
        super.onCreate(savedInstanceState);
    }
  @Override
  protected String getMainComponentName() {
    return "TimerAppRN";
  }
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
}

