import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addIcon } from '../actions/iconActions';

class AddIconForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tag: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const icon = {
      title: this.state.title,
      tag: this.state.tag
    };

    this.props.addIcon(icon);
  }

  render() {
    return (
      <div className='add-icon-section'>
        <h3>Add Icon</h3>
        <form onSubmit={this.onSubmit}>
          <div>
            <label htmlFor='inp-title' className='inp'>
              <input
                id='inp-title'
                type='text'
                placeholder='&nbsp;'
                name='title'
                onChange={this.onChange}
                value={this.state.title}
              />
              <span className='label'>Title</span>
              <span className='border'></span>
            </label>
          </div>

          <br />
          <div>
            <label htmlFor='inp-tag' className='inp'>
              <input
                id='inp-tag'
                placeholder='&nbsp;'
                type='text'
                name='tag'
                onChange={this.onChange}
                value={this.state.tag}
              />
              <span className='label'>Icon Tag</span>
              <span className='border'></span>
            </label>
          </div>
          <br />
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}

AddIconForm.propTypes = {
  addIcon: PropTypes.func.isRequired
};

export default connect(null, { addIcon })(AddIconForm);
