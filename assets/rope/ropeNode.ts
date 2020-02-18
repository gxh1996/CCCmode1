
const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeNode extends cc.Component {

    /**
     * 初始化
     * @param tp 尾部坐标
     * @param size 
     * @param angle 
     */
    init(tp: cc.Vec2, size: cc.Size, angle: number) {
        this.node.width = size.width;
        this.node.height = size.height;
        this.node.angle = angle;

        let dir: cc.Vec2 = this.getDirOfCenterPToHeadP();
        let p: cc.Vec2 = tp.add(dir);
        this.node.setPosition(p);
    }

    getTailP(): cc.Vec2 {
        let p: cc.Vec2 = this.node.getPosition();
        let dir: cc.Vec2 = this.getDirOfCenterPToHeadP();
        return p.sub(dir);
    }

    getHeadP(): cc.Vec2 {
        let p: cc.Vec2 = this.node.getPosition();
        let dir: cc.Vec2 = this.getDirOfCenterPToHeadP();
        return p.add(dir);
    }

    /**根据头部坐标设置节点坐标 */
    setPosByHeadP(hp: cc.Vec2) {
        let dir: cc.Vec2 = hp.sub(this.node.getPosition());
        this.node.angle = this.getAngleByDir(dir);

        dir = this.getDirOfCenterPToHeadP();
        let p: cc.Vec2 = hp.sub(dir);
        this.node.setPosition(p);
    }

    /**根据尾部坐标设置节点坐标 */
    setPosByTailP(tp: cc.Vec2) {
        let dir: cc.Vec2 = this.node.getPosition().sub(tp);
        this.node.angle = this.getAngleByDir(dir);

        dir = this.getDirOfCenterPToHeadP();
        let p: cc.Vec2 = tp.add(dir);
        this.node.setPosition(p);
    }

    /**中心坐标到头部中心坐标的距离向量 */
    private getDirOfCenterPToHeadP(): cc.Vec2 {
        let radian: number = this.aToRadian(this.node.angle);
        let l: number = this.node.width / 2;
        let dir: cc.Vec2 = cc.v2(l * Math.cos(radian), l * Math.sin(radian));
        return dir;
    }

    /**弧度转角度 */
    private rToAngle(r: number): number {
        return r * 180 / Math.PI;
    }

    /**角度转弧度 */
    private aToRadian(a: number): number {
        return a * Math.PI / 180;
    }

    /**
     * 通过方向向量得到角度
     * @param dir 方向向量
     * @returns degree [0,360)
     */
    private getAngleByDir(dir: cc.Vec2): number {
        let rot: number;
        if (dir.x === 0 && dir.y === 0)
            return null;
        if (dir.x === 0 && dir.y > 0) //y上半轴
            return 90;
        else if (dir.x === 0 && dir.y < 0) //y下半轴
            return 270;
        else { //不在y轴上
            let r: number = Math.atan(dir.y / dir.x);
            let d: number = r * 180 / Math.PI;
            rot = d;
        }

        if (rot === 0) //在x轴上
            if (dir.x > 0)
                rot = 0;
            else
                rot = 180;
        else if (dir.x < 0 && dir.y > 0 || dir.x < 0 && dir.y < 0) //在第二三象限
            rot += 180;
        else if (dir.x > 0 && dir.y < 0) //在第四象限
            rot += 360;
        return rot;
    }


}
