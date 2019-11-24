import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIcons, deleteIcon } from '../actions/iconActions';

class Icons extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.getIcons();
  }

  handleDelete(e) {
    this.props.deleteIcon(e.target.name);
  }

  render() {
    const iconItems = this.props.icons.map(icon => (
      <div key={icon.tag} className='icon-wrapper'>
        <div className='icon-individual'>
          <i className={'fas fa-' + icon.tag}></i>
        </div>
        <div className='icon-title'>
          <p>{icon.title}</p>
          <button
            className='icon-delete'
            name={icon.tag}
            onClick={this.handleDelete}
          >
            X
          </button>
        </div>
      </div>
    ));
    return (
      <React.Fragment>
        <h3>List of added icons</h3>
        <div className='icon-list-section'>{iconItems}</div>
      </React.Fragment>
    );
  }
}

Icons.propTypes = {
  getIcons: PropTypes.func.isRequired,
  deleteIcon: PropTypes.func.isRequired,
  icons: PropTypes.array
};

const mapStateToProps = state => ({
  icons: state.icons.items
});

export default connect(mapStateToProps, { getIcons, deleteIcon })(Icons);
