/*
    AtHome Control
    Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { DialogBox } from './dialog-box';
import { OKCancelDialogBox } from './okcancel-dialog-box';

/*
  The BaseComponent contains methods and functions that are
  usefull to derived classes. For example:

  timed message line - after 10 seconds the message is taken down
*/
export class BaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this.messageTimer = null;
        this.save_error = false;

        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.generateMessage = this.generateMessage.bind(this);
        this.messageTimerHandler = this.messageTimerHandler.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.generateMessage = this.generateMessage.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.renderDialogBox = this.renderDialogBox.bind(this);
        this.renderOKCancelDialogBox = this.renderOKCancelDialogBox.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onDialogOK = this.onDialogOK.bind(this);

        // Initial state with empty rows
        this.state = {
            messageText: "",
            modalShow: false,
            modalTitle: "",
            modalSubtitle: "",
            modalText: "",
            modalDialogBoxClose: this.modalClose,
            title: props.title,
            okCancelShow: false,
            okCancelTitle: "",
            okCancelSubtitle: "",
            okCancelText: "",
        };
    }

    componentWillUnmount() {
      // Cancel timer
      if (this.messageTimer) {
        clearInterval(this.messageTimer);
        this.messageTimer = null;
      }
    }

    generateMessage() {
      // Conditionally generates the message element
      let msg = "";
      if (this.state.messageText) {
        msg = <p className="alert alert-info" role="alert">{this.state.messageText}</p>;
      }
      return msg;
    }

    showMessage(text) {
      // Dispatch with an existing message
      this.messageTimerHandler();

      this.setState({messageText: text});

      // This will clear the message after 10 sec
      this.messageTimer = setInterval(this.messageTimerHandler, 10 * 1000);
    }

    messageTimerHandler() {
      // Conditionally clear the message timer
      if (this.messageTimer) {
        clearInterval(this.messageTimer);
        this.messageTimer = null;
      }
      this.setState({messageText: ""});
    }

    renderDialogBox() {
      return (
        <DialogBox
          title={this.state.modalTitle}
          subtitle={this.state.modalSubtitle}
          text={this.state.modalText}
          show={this.state.modalShow}
          onHide={this.state.modalDialogBoxClose}
        >
        </DialogBox>
      );
    }

    renderOKCancelDialogBox() {
      return (
        <OKCancelDialogBox
          title={this.state.okCancelTitle}
          subtitle={this.state.okCancelSubtitle}
          text={this.state.okCancelText}
          show={this.state.okCancelShow}
          onOK={this.onDialogOK}
          onCancel={this.onDialogCancel}
        >
        </OKCancelDialogBox>
      );
    }

    modalClose() {
      this.setState({ modalShow: false });
    }

    showDialogBox(title, subtitle, text, close=this.modalClose) {
      const new_state = {
        modalShow: true,
        modalTitle: title,
        modalSubtitle: subtitle,
        modalText: text,
        modalDialogBoxClose: close
      };
      this.setState({...this.state, ...new_state});
    }

    showOKCancelDialogBox(title, subtitle, text) {
      const new_state = {
        okCancelShow: true,
        okCancelTitle: title,
        okCancelSubtitle: subtitle,
        okCancelText: text
      };
      this.setState({...this.state, ...new_state});
    }

    onDialogCancel() {
      this.setState({ okCancelShow: false });
    }

    onDialogOK() {
      this.setState({ okCancelShow: false });
    }
}

BaseComponent.propTypes = {
};

BaseComponent.defaultProps = {
};
