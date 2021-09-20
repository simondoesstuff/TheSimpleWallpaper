(() => {
    let dragInProgress = 0;


    function startDrag(event) {
        dragInProgress = 1;
    }

    function persistDrag(event) {
        if (!dragInProgress) return;

        dragInProgress = 2;

        const deltaPos = {
            x: event.movementX,
            y: event.movementY
        }

        console.log(`drag: {${JSON.stringify({x: deltaPos.x, y: deltaPos.y}, null, 1)}`)

        const newEvent = new CustomEvent('canvasBeingDragged', {
            detail: {
                moveEvent: event,
                deltaPosition: deltaPos
            }
        });

        canvas.dispatchEvent(newEvent);
    }

    function endDrag(event) {
        // this will prevent the clicking event in the case of dragging
        if (dragInProgress !== 1)
            event.preventDefault();

        dragInProgress = 0;
    }



    // ---------------------------------------------------
    //                  event listeners
    // ---------------------------------------------------

    canvas.addEventListener('mousedown', event => startDrag(event))
    canvas.addEventListener('mouseup', event => endDrag(event))
    canvas.addEventListener('mouseout', event => endDrag(event))
    canvas.addEventListener('mousemove', event => persistDrag(event))

    canvas.addEventListener('click', event => {
        console.log(`canvas click: (${event.movementX}, ${event.movementY})`)
    })
})();
