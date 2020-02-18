import RopeNode from "./ropeNode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rope extends cc.Component {

    @property(cc.Prefab)
    private ropeNode: cc.Prefab = null;

    @property({ tooltip: "绳子的段数" })
    private ropeNodeNum: number = 10;

    @property({
        tooltip: "绳子每小段的大小"
    })
    private ropeNodeSize: cc.Size = new cc.Size(3, 1);

    @property()
    private isFix: boolean = false;

    /**绳子尾部初始位置 */
    private initP: cc.Vec2 = cc.v2();

    private ropeNodeArr: RopeNode[] = [];

    private gra: cc.Graphics = null;

    private isTouch: boolean = false;
    private touchLocation: cc.Vec2 = null;

    onLoad() {
        this.gra = this.node.getComponent(cc.Graphics);

        this.node.on(cc.Node.EventType.TOUCH_START, this.touch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    start() {
        // this.gra.moveTo(0, 0);
        // this.gra.lineTo(10, 10)
        // this.gra.stroke()
        this.init();
    }

    private init() {
        let ropeNode: RopeNode;
        let i: number;
        for (i = 0; i < this.ropeNodeNum; i++) {
            ropeNode = this.getRopeNode();
            if (i === 0) {
                ropeNode.init(this.initP, this.ropeNodeSize, i);
            }
            else {
                ropeNode.init(this.ropeNodeArr[i - 1].getHeadP(), this.ropeNodeSize, i);
            }
        }

        this.drawRope();
    }

    private drawRope() {
        this.gra.clear();

        let i: number;
        let ropeN: RopeNode;
        let p: cc.Vec2;
        for (i = 0; i < this.ropeNodeArr.length; i++) {

            if (i % 2 === 0)
                this.gra.strokeColor = cc.Color.RED;
            else
                this.gra.strokeColor = cc.Color.BLACK;


            ropeN = this.ropeNodeArr[i];
            this.gra.lineWidth = ropeN.node.height;
            p = ropeN.getTailP();
            this.gra.moveTo(p.x, p.y);
            p = ropeN.getHeadP();
            this.gra.lineTo(p.x, p.y);
            this.gra.stroke();
        }
    }

    private getRopeNode(): RopeNode {
        let n: cc.Node = cc.instantiate(this.ropeNode);
        this.node.addChild(n);
        let script: RopeNode = n.getComponent("ropeNode");
        this.ropeNodeArr.push(script);
        return script;
    }

    private touch(e: cc.Touch) {
        this.isTouch = true;
        this.touchLocation = this.node.parent.convertTouchToNodeSpaceAR(e);
    }
    private touchEnd(e: cc.Touch) {
        this.isTouch = false;
    }

    update(dt) {
        if (!this.isTouch)
            return;

        if (this.ropeNodeArr[this.ropeNodeArr.length - 1].getHeadP().equals(this.touchLocation))
            return;

        let i: number;
        let ropeN: RopeNode;
        for (i = this.ropeNodeArr.length - 1; i > -1; i--) {
            ropeN = this.ropeNodeArr[i];
            if (i === this.ropeNodeArr.length - 1)
                ropeN.setPosByHeadP(this.touchLocation);
            else
                ropeN.setPosByHeadP(this.ropeNodeArr[i + 1].getTailP());
        }

        if (this.isFix && !this.ropeNodeArr[0].getTailP().equals(this.initP)) {
            for (i = 0; i < this.ropeNodeArr.length; i++) {
                ropeN = this.ropeNodeArr[i];
                if (i === 0)
                    ropeN.setPosByTailP(this.initP);
                else
                    ropeN.setPosByTailP(this.ropeNodeArr[i - 1].getHeadP());
            }
        }


        this.drawRope();
    }
}
