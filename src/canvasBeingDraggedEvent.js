(() => {
    let previousPosition = null;


    function startDrag(event) {
        const {clientX: x, clientY: y} = event;

        previousPosition = {x, y};
    }

    function persistDrag(event) {
        if (!previousPosition) return;

        // const { clientX: x, clientY: y } = event;
        // const deltaPos = {
        //     x: x - previousPosition.x,
        //     y: y - previousPosition.y
        // };

        const deltaPos = {
            x: event.offsetX,
            y: event.offsetY
        }

        console.log(`drag: {${JSON.stringify({x: event.screenX, y: event.screenY}, null, 1)}`)

        previousPosition.x += deltaPos.x;
        previousPosition.y += deltaPos.y;

        const newEvent = new CustomEvent('canvasBeingDragged', {
            detail: {
                moveEvent: event,
                deltaPosition: deltaPos
            }
        });

        canvas.dispatchEvent(newEvent);
    }

    function endDrag(event) {
        previousPosition = null;
    }



    // ---------------------------------------------------
    //                  event listeners
    // ---------------------------------------------------

    canvas.addEventListener('mousedown', event => startDrag(event))
    canvas.addEventListener('mouseup', event => endDrag(event))
    canvas.addEventListener('mouseout', event => endDrag(event))
    canvas.addEventListener('mousemove', event => persistDrag(event))
})();
