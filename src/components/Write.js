import React from 'react';
import PropTypes from 'prop-types';

class Write extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            contents : ''
        };
        this.hanldleChange = this.hanldleChange.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    hanldleChange(e) {
        this.setState({
            contents : e.target.value
        });
    }

    handlePost() {
        // 작성 완료시 초기화시키는 함수
        let contents = this.state.contents;
        
        this.props.onPost(contents).then(
            () => {
                this.setState({
                    contents : ""
                    // 작성이 완료되면 내용을 비우는 함수
                });
            }
        );
    }

    render() {

        return (
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            className="materialize-textarea" 
                            placeholder="Write down your memo"
                            value = {this.state.contents}
                            onChange = {this.hanldleChange}
                        ></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.handlePost}>POST</a>
                    </div>
                </div>
            </div>
        );
    }
}

Write.propTypes = {
    onPost: PropTypes.func
};

Write.defaultProps = {
    onPost: (contents) => { console.error('post function not defined'); }
};


export default Write;