import { ElmArchService, msgOf } from 'elm-rx';
import { merge } from 'lodash-es';
import { ElmRxMsg } from 'elm-rx/src/ElmRxMsg';

interface IYameUIModel {
    enableHmd: boolean;
    enablePreview: boolean;
}

export class ToggleHmd extends msgOf('ToggleHmd')<{}>() { }

export class TogglePreview extends msgOf('TogglePreview')<{}>() { }

type UIMsg = ToggleHmd | TogglePreview;

export class YameUIService extends ElmArchService<IYameUIModel, UIMsg> {
    protected initModel(): IYameUIModel {
        return {
            enableHmd: false,
            enablePreview: true
        };
    }
    update() {
        return (model: IYameUIModel, msg: UIMsg) => {
            switch (msg.type) {
                case 'ToggleHmd':
                    return merge(model, { enableHmd: !model.enableHmd });
                case 'TogglePreview':
                    return merge(model, { enablePreview: !model.enablePreview });
                default:
                    assertNever(msg);
            }
        };
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
