/*
    React + Bootstrap dialog call stack for handling nested dialogs
    Copyright © 2016  Dave Hocker (email: AtHomeX10@gmail.com)

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

var callStack = [];

/*
    Call a dialog by id (sans the "#")
*/
export function callDialog(dialog_id) {
    console.log("Calling dialog: " + dialog_id);

    // If there is a current dialog, remove its hide handler
    if (callStack.length) {
        $("#" + callStack[callStack.length - 1]).off('hide.bs.modal');
    }

    // Hide current dialog
    if (callStack.length > 0) {
        $("#" + callStack[callStack.length - 1]).modal("hide");
    }

    // Show the new dialog
    callStack.push(dialog_id);
    showModalDialog(dialog_id);
}

/*
    Return from the current dialog to the previous dialog
*/
export function returnFromDialog() {
    var currentDialogId = "#" + callStack[callStack.length - 1];

    // Remove unsolicited hide event handler for current dialog
    $(currentDialogId).off('hide.bs.modal');

    // Hide current dialog
    if (callStack.length > 0) {
        $(currentDialogId).modal("hide");
    }
    callStack.pop();
    // Bring forth the last dialog
    if (callStack.length > 0) {
        console.log("Returning to dialog: " + callStack[callStack.length - 1]);
        showModalDialog(callStack[callStack.length - 1]);
    }
    else {
        console.log("Returning to page");
    }
}

/*
    Handle case were user clicks off of the dialog box thereby causing
    the dialog box to be hidden.
*/
function dialogHideEvent() {
    console.log("Unsolicited dialog hide");
    returnFromDialog();
}

/*
    Show a modal dialog box
*/
function showModalDialog(id) {
    var jqid = "#" + id;
    $(jqid).modal("show");
    // If this dialog is hidden, we'll act like a return
    $(jqid).on('hide.bs.modal', dialogHideEvent);
}