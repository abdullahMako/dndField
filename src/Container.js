import update from "immutability-helper";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { DraggableBox } from "./DraggableBox.js";
import { ItemTypes } from "./ItemTypes.js";
import Picture from "./Picture.js";
import { snapToGrid as doSnapToGrid } from "./snapToGrid.js";
import { v4 as uuidv4 } from "uuid";

const styles = {
  width: 300,
  height: 300,
  border: "1px solid black",
  position: "relative"
};

const PictureList = [
  {
    id: 1,
    url:
      "https://yt3.ggpht.com/ytc/AAUvwnjOQiXUsXYMs8lwrd4litEEqXry1-atqJavJJ09=s900-c-k-c0x00ffffff-no-rj"
  },
  {
    id: 2,
    url:
      "https://yt3.ggpht.com/ytc/AAUvwnjOQiXUsXYMs8lwrd4litEEqXry1-atqJavJJ09=s900-c-k-c0x00ffffff-no-rj"
  },
  {
    id: 3,
    url:
      "https://yt3.ggpht.com/ytc/AAUvwnjOQiXUsXYMs8lwrd4litEEqXry1-atqJavJJ09=s900-c-k-c0x00ffffff-no-rj"
  }
];

export const Container = ({ snapToGrid }) => {
  const [boxes, setBoxes] = useState({
    a: { top: 20, left: 80, title: "Drag me around", page: 1 },
    b: { top: 180, left: 20, title: "Drag me too", page: 1 },
    c: { top: 160, left: 20, title: "Drag me also", page: 1 }
  });
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top }
          }
        })
      );
    },
    [boxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        console.log(item);
        if (item.new) {
          addToBox(item);
          return undefined;
        }
        const delta = monitor.getDifferenceFromInitialOffset();
        let left = Math.round(item?.left + delta.x);
        let top = Math.round(item?.top + delta.y);
        if (snapToGrid) {
          [left, top] = doSnapToGrid(left, top);
        }

        moveBox(item.id, left, top);
        return undefined;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    [moveBox]
  );

  const [, drop2] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        console.log(item);
        if (item.new) {
          addToBox(item);
          return undefined;
        }
        const delta = monitor.getDifferenceFromInitialOffset();
        let left = Math.round(item?.left + delta.x);
        let top = Math.round(item?.top + delta.y);
        if (snapToGrid) {
          [left, top] = doSnapToGrid(left, top);
        }

        moveBox(item.id, left, top);
        return undefined;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    [moveBox]
  );

  function addToBox(item) {
    setBoxes((old) => ({
      ...old,
      [uuidv4()]: { top: 0, left: 0, title: "Drag me also new" }
    }));
  }
  return (
    <>
      <div className="Pictures">
        {PictureList.map((picture) => {
          return <Picture url={picture.url} id={picture.id} />;
        })}
      </div>
      <div ref={drop} style={styles}>
        {Object.keys(boxes).map((key) => (
          <DraggableBox key={key} id={key} {...boxes[key]} />
        ))}
      </div>

      <div ref={drop2} style={styles}>
        {Object.keys(boxes).map((key) => (
          <DraggableBox key={key} id={key} {...boxes[key]} />
        ))}
      </div>
    </>
  );
};
