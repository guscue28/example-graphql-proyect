package com.ogma.movy;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle;
import android.os.Build;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.media.AudioAttributes;
import android.net.Uri;
import androidx.core.app.NotificationCompat;

public class MainActivity extends ReactActivity {


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      // Create channel to show notifications Chats.
      NotificationChannel notificationChannelChat = new NotificationChannel("Chat Channel", "Movy", NotificationManager.IMPORTANCE_HIGH);
      notificationChannelChat.setShowBadge(true);
      notificationChannelChat.setDescription("");
      AudioAttributes att = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannelChat.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/chat_alert"), att);
      notificationChannelChat.enableVibration(true);
      notificationChannelChat.setVibrationPattern(new long[]{400, 400});
      notificationChannelChat.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager manager = getSystemService(NotificationManager.class);
      manager.createNotificationChannel(notificationChannelChat);

      // Create channel to show notifications System.
      NotificationChannel notificationChannelSystem = new NotificationChannel("System Channel", "Movy", NotificationManager.IMPORTANCE_HIGH);
      notificationChannelSystem.setShowBadge(true);
      notificationChannelSystem.setDescription("");
      AudioAttributes attr = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannelSystem.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/alert"), attr);
      notificationChannelSystem.enableVibration(true);
      notificationChannelSystem.setVibrationPattern(new long[]{400, 400});
      notificationChannelSystem.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager managerSys = getSystemService(NotificationManager.class);
      managerSys.createNotificationChannel(notificationChannelSystem);
    }
    super.onCreate(savedInstanceState);
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Movy";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
