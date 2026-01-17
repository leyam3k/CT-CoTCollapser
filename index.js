// CT-CoTCollapser
// An extension to easily collapse reasoning/CoT blocks by pressing (long-press) or double-tapping.

(function () {
    // Configuration
    const CONFIG = {
        longPressDuration: 300, // ms
        doubleTapDelay: 300, // ms
        moveThreshold: 5, // pixels
    };

    /**
     * Helper to close an open details element
     * @param {jQuery} $details
     */
    function collapseDetails($details) {
        if ($details && $details.length && $details.is("[open]")) {
            $details.removeAttr("open");
        }
    }

    /**
     * Target Definitions
     * Defines selectors and logic for finding the collapsible element from the trigger.
     */
    const TARGETS = [
        // Standard SillyTavern Reasoning Block
        {
            selector: ".mes_reasoning",
            getCollapsible: function ($target) {
                return $target.closest("details.mes_reasoning_details");
            },
            isValid: () => true,
        },
        // SteppedThinking Extension Support
        {
            selector: ".mes_text",
            getCollapsible: function ($target) {
                return $target.find('details[type="executing"][open]');
            },
            isValid: function ($target) {
                const $mes = $target.closest(".mes");
                return $mes.attr("ch_name") === "SteppedThinking";
            },
        },
    ];

    // State Variables
    let pressTimer = null;
    let startX = 0;
    let startY = 0;
    let lastTapTime = 0;

    /**
     * Handle Long Press (Desktop/Mouse)
     */
    function handleMouseDown(e) {
        const $target = $(this);
        const targetDef = TARGETS.find(
            (t) => $target.is(t.selector) && t.isValid($target),
        );

        if (!targetDef) return;

        startX = e.pageX;
        startY = e.pageY;

        pressTimer = window.setTimeout(function () {
            const $collapsible = targetDef.getCollapsible($target);
            collapseDetails($collapsible);
        }, CONFIG.longPressDuration);

        // Cancel on move
        $target.on("mousemove.longPress", function (moveEvent) {
            if (
                Math.abs(moveEvent.pageX - startX) > CONFIG.moveThreshold ||
                Math.abs(moveEvent.pageY - startY) > CONFIG.moveThreshold
            ) {
                clearTimeout(pressTimer);
                $target.off("mousemove.longPress");
            }
        });
    }

    function handleMouseUpOrLeave() {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
        $(this).off("mousemove.longPress");
    }

    /**
     * Handle Double Click (Desktop/Mouse)
     * Native dblclick event
     */
    function handleDoubleClick(e) {
        const $target = $(this);
        const targetDef = TARGETS.find(
            (t) => $target.is(t.selector) && t.isValid($target),
        );

        if (!targetDef) return;

        // Prevent selecting text on double click if we are collapsing
        // e.preventDefault(); // Optional: might annoy users if they want to select word.
        // Let's only collapse.

        const $collapsible = targetDef.getCollapsible($target);
        collapseDetails($collapsible);
    }

    /**
     * Handle Double Tap (Mobile/Touch)
     */
    function handleTouchEnd(e) {
        const $target = $(this);
        const targetDef = TARGETS.find(
            (t) => $target.is(t.selector) && t.isValid($target),
        );

        if (!targetDef) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < CONFIG.doubleTapDelay && tapLength > 0) {
            const $collapsible = targetDef.getCollapsible($target);
            collapseDetails($collapsible);
            lastTapTime = 0;
        } else {
            lastTapTime = currentTime;
        }
    }

    // Initialization
    $(document).ready(function () {
        // Construct selector string for all targets
        const selectorString = TARGETS.map((t) => t.selector).join(", ");

        // Bind Events
        $(document)
            .on("mousedown", selectorString, handleMouseDown)
            .on("mouseup mouseleave", selectorString, handleMouseUpOrLeave)
            .on("dblclick", selectorString, handleDoubleClick)
            .on("touchend", selectorString, handleTouchEnd);

        console.log("[CT-CoTCollapser] Initialized.");
    });
})();
