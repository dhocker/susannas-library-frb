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
    // Hide current dialog
    if (callStack.length > 0) {
        $("#" + callStack[callStack.length - 1]).modal("hide");
    }
    callStack.push(dialog_id);
    // Show the new dialog
    $("#" + dialog_id).modal("show");
}

/*
    Return from the current dialog to the previous dialog
*/
export function returnFromDialog() {
    // Hide current dialog
    if (callStack.length > 0) {
        $("#" + callStack[callStack.length - 1]).modal("hide");
    }
    callStack.pop();
    // Bring forth the last dialog
    if (callStack.length > 0) {
        console.log("Returning to dialog: " + callStack[callStack.length - 1]);
        $("#" + callStack[callStack.length - 1]).modal("show");
    }
    else {
        console.log("Returning to page");
    }
}