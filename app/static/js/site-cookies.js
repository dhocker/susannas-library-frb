/*
    Susanna's New Library
    Copyright (C) 2016  Dave Hocker (email: AtHomeX10@gmail.com)

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

import * as cookiejar from './cookie-jar';

const PAGE_SIZE_COOKIE = "pagesize";
export const PAGE_SIZE_DEFAULT = 15;

export function getPageSize() {
    var ps = cookiejar.getCookieInteger(PAGE_SIZE_COOKIE);
    return ps ? ps : PAGE_SIZE_DEFAULT;
}

export function setPageSize(ps) {
    cookiejar.setCookie(PAGE_SIZE_COOKIE, ps, 365 * 10);
}