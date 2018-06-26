export interface CircleType {
    x: number;
    y: number;
    r: number;
}

export interface ReactType {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function checkIntersects(circle: CircleType, rect: ReactType) {
    const circleDistanceX = Math.abs(circle.x - rect.x);
    const circleDistanceY = Math.abs(circle.y - rect.y);

    if (circleDistanceX > (rect.width / 2 + circle.r) || circleDistanceY > (rect.height / 2 + circle.r)) {
        return false;
    }

    if (circleDistanceX <= (rect.width / 2) || circleDistanceY <= (rect.height / 2)) {
        return true;
    }

    const cornerDistanceSQ = (circleDistanceX - rect.width / 2) ^ 2 +
        (circleDistanceY - rect.height / 2) ^ 2;

    return (cornerDistanceSQ <= (circle.r ^ 2));
}
