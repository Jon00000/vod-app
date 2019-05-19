import React from 'react';

class BaseComponent extends React.Component {
    constructor(props){
        super(props);
        this.goPage = this.goPage.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    /**
     * 用户自定义表单的值
     * @param fomeName  用户自定义传递的参数
     * @param changeVal 修改之后的结果
     */
    inputChange(fomeName, changeVal) {
        let tempObj = {};
        tempObj[fomeName] = changeVal;
        this.setState({
            ...tempObj
        });
    }
    // 判断是否是开发环境还是生产环境
    isDevEnv () {
        if (global.constants.process_env === 'dev') {
            return true;
        } else {
            return false;
        }
    }

    setTitleName(titleName){
        document.title = titleName;
    }

    //  跳转到指定URL路径
    goPage(params){
        // 如果传递的是字符串URL，则跳转
        if(typeof params === "string"){
            let pathObj = {
                // pathname 这个值是不能改的，表示Link需要跳转的界面
                pathname: params,
            };
            this.props.history.push(pathObj);
        }else{// 如果传递的是对象，则直接传递对象，方便传递参数
            this.props.history.push(params);
        }
    }
}

export default BaseComponent;
