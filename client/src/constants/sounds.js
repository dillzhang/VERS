const SOUNDS = {
  /* DESKTOP SOUNDS */
  click: {
    // Path to the file
    source: "/sounds/click.mp3",
    // If true, sound will continue playing if played again while playing
    // If false, sound start playing from beginning if played again
    dnd: false,
    // Duration sound should be played for in milliseconds
    duration: -1,
    // If true, new sound will be created. sounds cannot be stopped
    createNew: true,
  },
  messageSent: {
    source: "/sounds/message-sent.mp3",
    dnd: false,
    duration: -1,
    createNew: true,
  },
  messageReceived: {
    source: "/sounds/message-received.mp3",
    dnd: false,
    duration: -1,
    createNew: true,
  },
  newApp: {
    source: new Audio("/sounds/new-app.mp3"),
    dnd: false,
    duration: -1,
  },
  warning: {
    source: new Audio("/sounds/warning.mp3"),
    dnd: false,
    duration: -1,
  },
  footstepsOutside: {
    source: new Audio("/sounds/footsteps-outside.mp3"),
    dnd: false,
    duration: -1,
  },
  ambiance: {
    source: new Audio("/sounds/test.mp3"),
    dnd: true,
    duration: -1,
  },
  /* SHOW SOUNDS */
  S0_desert_ambience: {
    source: new Audio("/sounds/S0-desert-ambience.mp3"),
    dnd: true,
    duration: -1,
  },
  S0_walk: {
    source: new Audio("/sounds/S0-walk.mp3"),
    dnd: false,
    duration: -1,
  },
  S0_trip_alarm: {
    source: new Audio("/sounds/S0-trip-alarm.mp3"),
    dnd: false,
    duration: -1,
  },
  S1_warehouse_ambience: {
    source: new Audio("/sounds/S1-warehouse-ambience.mp3"),
    dnd: true,
    duration: -1,
  },
  S1_walk_1: {
    source: new Audio("/sounds/S1-walk-1.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_walk_2: {
    source: new Audio("/sounds/S1-walk-2.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_walk_3: {
    source: new Audio("/sounds/S1-walk-3.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_get_camera: {
    source: new Audio("/sounds/S1-get-camera.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_walk_to_box: {
    source: new Audio("/sounds/S1-walk-to-box.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_open_box: {
    source: new Audio("/sounds/S1-open-box.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_insert_plug: {
    source: new Audio("/sounds/S1-insert-plug.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_flip_switch_close_box: {
    source: new Audio("/sounds/S1-flip-switch-close-box.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_walk_to_elevator: {
    source: new Audio("/sounds/S1-walk-to-elevator.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_brush_buttons: {
    source: new Audio("/sounds/S1-brush-buttons.mp3"),
      dnd: false,
      duration: -1,
  },
  S1_call_elevator: {
    source: new Audio("/sounds/S1-call-elevator.mp3"),
      dnd: false,
      duration: -1,
  },
  S2_elevator_ambience: {
    source: new Audio("/sounds/S2-elevator-ambience.mp3"),
      dnd: true,
      duration: -1,
  },
  S2_elevator_1_floor_delta: {
    source: new Audio("/sounds/S2-elevator-1-floor-delta.mp3"),
      dnd: false,
      duration: -1,
  },
  S2_elevator_2_floor_delta: {
    source: new Audio("/sounds/S2-elevator-2-floor-delta.mp3"),
      dnd: false,
      duration: -1,
  },
  S2_elevator_3_floor_delta: {
    source: new Audio("/sounds/S2-elevator-3-floor-delta.mp3"),
      dnd: false,
      duration: -1,
  },
  S2_elevator_4_floor_delta: {
    source: new Audio("/sounds/S2-elevator-4-floor-delta.mp3"),
      dnd: false,
      duration: -1,
  },
  S3_hallway_ambience: {
    source: new Audio("/sounds/S3-hallway-ambience.mp3"),
      dnd: true,
      duration: -1,
  },
  S4_setup_video: {
    source: new Audio("/sounds/S4-setup-video.mp3"),
      dnd: false,
      duration: -1,
  },
  S4_run_1: {
    source: new Audio("/sounds/S4-run-1.mp3"),
      dnd: true,
      duration: -1,
  },
  S4_run_2: {
    source: new Audio("/sounds/S4-run-2.mp3"),
      dnd: true,
      duration: -1,
  },
  S4_security_alert: {
    source: new Audio("/sounds/S4-security-alert.mp3"),
      dnd: false,
      duration: -1,
  },
  S4_final_run: {
    source: new Audio("/sounds/S4-final-run.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_vault_door_ambience: {
    source: new Audio("/sounds/S5-vault-door-ambience.mp3"),
      dnd: true,
      duration: -1,
  },
  S5_keypad_id_number_6: {
    source: new Audio("/sounds/S5-keypad-id-number-6.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_press_1: {
    source: new Audio("/sounds/S5-keypad-press-1.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_carrigan_8: {
    source: new Audio("/sounds/S5-keypad-carrigan-8.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_charmainelane_14: {
    source: new Audio("/sounds/S5-keypad-charmainelane-14.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_zipcode_5: {
    source: new Audio("/sounds/S5-keypad-zipcode-5.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_year_4: {
    source: new Audio("/sounds/S5-keypad-year-4.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_phonenumber_10: {
    source: new Audio("/sounds/S5-keypad-phonenumber-10.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_keypad_austin_5: {
    source: new Audio("/sounds/S5-keypad-austin-5.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_30_beeps: {
    source: new Audio("/sounds/S5-30-beeps.mp3"),
      dnd: false,
      duration: -1,
  },
  S5_access_denied: {
    source: new Audio("/sounds/S5-access-denied.mp3"),
    dnd: false,
    duration: -1,
  },
  S5_unlock: {
    source: new Audio("/sounds/S5-unlock.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_vault_ambience: {
    source: new Audio("/sounds/S6-vault-ambience.mp3"),
      dnd: true,
      duration: -1,
  },
  S6_walk_1: {
    source: new Audio("/sounds/S6-walk-1.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_walk_2: {
    source: new Audio("/sounds/S6-walk-2.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_walk_3: {
    source: new Audio("/sounds/S6-walk-3.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_keyboard_1: {
    source: new Audio("/sounds/S6-keyboard-1.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_keyboard_2: {
    source: new Audio("/sounds/S6-keyboard-2.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_radio: {
    source: new Audio("/sounds/S6-radio.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_jump_scare: {
    source: new Audio("/sounds/S6-jump-scare.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_success: {
    source: new Audio("/sounds/S6-success.mp3"),
      dnd: false,
      duration: -1,
  },
  S6_failure: {
    source: new Audio("/sounds/S6-failure.mp3"),
      dnd: false,
      duration: -1,
  }
};

export { SOUNDS };
