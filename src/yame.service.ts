import { ElmArchService, msgOf } from 'elm-rx';
import { merge } from 'lodash-es';
import { Subject } from 'rxjs';

interface IYameUIModel {
    enableHmd: boolean;
    enablePreview: boolean;
    srcLine: number;
    /**
     * 表示需要在预览窗口滚动到源码中的行号
     *
     * @type {number}
     * @memberof IYameUIModel
     */
    previewLine: number;
}

export class ToggleHmd extends msgOf('ToggleHmd')<{}>() { }

export class TogglePreview extends msgOf('TogglePreview')<{}>() { }

export class LineScrolled extends msgOf('LineScrolled')<{
    origin: 'src' | 'preview';
    line: number;
}>() { }

type UIMsg = ToggleHmd | TogglePreview | LineScrolled;

export class YameUIService extends ElmArchService<IYameUIModel, UIMsg> {
    unSub = new Subject();
    protected initModel(): IYameUIModel {
        return {
            enableHmd: false,
            enablePreview: true,
            srcLine: 1,
            previewLine: 1
        };
    }
    update() {
        return (model: IYameUIModel, msg: UIMsg) => {
            switch (msg.type) {
                case 'ToggleHmd':
                    return merge(model, { enableHmd: !model.enableHmd });
                case 'TogglePreview':
                    return merge(model, { enablePreview: !model.enablePreview });
                case 'LineScrolled':
                    const { origin, line } = msg.payload;
                    switch (origin) {
                        case 'preview':
                            if (line === model.previewLine) {
                                return model;
                            }
                            return merge(model, { srcLine: line });
                        case 'src':
                            if (line === model.srcLine) {
                                return model;
                            }
                            return merge(model, { previewLine: line });
                        default:
                            assertNever(origin);
                            return model;
                    }
                default:
                    assertNever(msg);
            }
        };
    }

    destroy() {
        super.destroy();
        this.unSub.next();
        this.unSub.complete();
    }
}

interface IYameAppModel {
    src: string;
}

export class UpdateSrc extends msgOf('UpdateSrc')<string>() { }

type AppMsg = UpdateSrc;

export class YameAppService extends ElmArchService<IYameAppModel, AppMsg> {
    protected initModel(): IYameAppModel {
        return {
            src: '*今天想要写点什么？*'
        };
    }

    update() {
        return (model: IYameAppModel, msg: AppMsg) => {
            switch (msg.type) {
                case 'UpdateSrc':
                    return merge(model, { src: msg.payload });
            }
        };
    }

}

function assertNever(msg: never) {
    throw Error('never');
}
