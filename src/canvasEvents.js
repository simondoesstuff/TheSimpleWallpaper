(() => {
    let dragInProgress = 0;


    function startDrag() {
        dragInProgress = 1;
    }


    function persistDrag(event) {
        if (!dragInProgress) return;

        dragInProgress = 2;

        const deltaPos = {
            x: event.movementX,
            y: event.movementY
        }

        const newEvent = new CustomEvent('canvasBeingDragged', {
            detail: {
                moveEvent: event,
                deltaPosition: deltaPos
            }
        });

        canvas.dispatchEvent(newEvent);
    }


    function endDrag() {
        if (dragInProgress === 1) {
            document.getElementById('controls').classList.replace('hide', 'show')
        }

        dragInProgress = 0;
    }


    // ---------------------------------------------------
    //                  event listeners
    // ---------------------------------------------------


    canvas.addEventListener('mousedown', event => startDrag(event));
    canvas.addEventListener('mouseup', event => endDrag(event));
    canvas.addEventListener('mouseout', event => endDrag(event));
    canvas.addEventListener('mousemove', event => persistDrag(event));
})();
