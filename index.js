$(document).ready(function () {
    // Configuration for long press (desktop)
    const longPressDuration = 300; // Duration in milliseconds for a long press
    let pressTimer;
    let startX, startY;
    const moveThreshold = 5; // Movement threshold in pixels

    // Desktop: long press detection using mouse events on .mes_reasoning (original)
    $(document).on("mousedown", ".mes_reasoning", function (e) {
        const $this = $(this);
        startX = e.pageX;
        startY = e.pageY;

        pressTimer = window.setTimeout(function () {
            const $details = $this.closest("details.mes_reasoning_details");
            if ($details.length && $details.is("[open]")) {
                $details.removeAttr("open");
            }
        }, longPressDuration);

        // Prevent text selection by cancelling the timer if the user moves too much
        $this.on("mousemove.longPress", function (e) {
            let moveX = e.pageX;
            let moveY = e.pageY;
            if (
                Math.abs(moveX - startX) > moveThreshold ||
                Math.abs(moveY - startY) > moveThreshold
            ) {
                clearTimeout(pressTimer);
                $this.off("mousemove.longPress");
            }
        });
    });

    // Cancel the long press if the mouse is released or leaves the element (original)
    $(document).on("mouseup mouseleave", ".mes_reasoning", function () {
        clearTimeout(pressTimer);
        $(this).off("mousemove.longPress");
    });

    // Mobile: Use double-tap detection instead of long press for .mes_reasoning (original)
    let lastTapTime = 0;
    const doubleTapDelay = 300; // Maximum delay between taps in milliseconds
    $(document).on("touchend", ".mes_reasoning", function (e) {
        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTapTime;
        if (tapLength < doubleTapDelay && tapLength > 0) {
            const $details = $(this).closest("details.mes_reasoning_details");
            if ($details.length && $details.is("[open]")) {
                $details.removeAttr("open");
            }
            lastTapTime = 0; // reset
        } else {
            lastTapTime = currentTime;
        }
    });

    // --- Additional functionality for .mes_text of SteppedThinking ---
    // Desktop: long press on .mes_text with ch_name "SteppedThinking"
    $(document).on("mousedown", ".mes_text", function (e) {
        const $mes = $(this).closest(".mes");
        // Only proceed if the message's ch_name is "SteppedThinking"
        if ($mes.attr("ch_name") !== "SteppedThinking") return;

        startX = e.pageX;
        startY = e.pageY;

        pressTimer = window.setTimeout(() => {
            // Find the <details> with type executing that is open
            const $detailsExec = $(this).find(
                'details[type="executing"][open]',
            );
            if ($detailsExec.length) {
                $detailsExec.removeAttr("open");
            }
        }, longPressDuration);

        // Cancel timer if movement is too high
        $(this).on("mousemove.longPress", function (e) {
            let moveX = e.pageX;
            let moveY = e.pageY;
            if (
                Math.abs(moveX - startX) > moveThreshold ||
                Math.abs(moveY - startY) > moveThreshold
            ) {
                clearTimeout(pressTimer);
                $(this).off("mousemove.longPress");
            }
        });
    });

    // Cancel the long press for .mes_text if the mouse is released or leaves
    $(document).on("mouseup mouseleave", ".mes_text", function () {
        clearTimeout(pressTimer);
        $(this).off("mousemove.longPress");
    });

    // Mobile: double-tap detection on .mes_text for SteppedThinking
    let lastTapTimeText = 0;
    $(document).on("touchend", ".mes_text", function (e) {
        const $mes = $(this).closest(".mes");
        if ($mes.attr("ch_name") !== "SteppedThinking") return;

        let currentTime = new Date().getTime();
        let tapLength = currentTime - lastTapTimeText;
        if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double-tap detected: collapse the details with type executing if open
            const $detailsExec = $(this).find(
                'details[type="executing"][open]',
            );
            if ($detailsExec.length) {
                $detailsExec.removeAttr("open");
            }
            lastTapTimeText = 0; // reset
        } else {
            lastTapTimeText = currentTime;
        }
    });
});
