/**
 * Created by alsayed on 5/12/17.
 */
var path = require('path');
var rootPath = path.resolve('.');
var Promise = require('bluebird');
var dateHelper = require(rootPath + '/helpers/DateHelper');

module.exports = {

    /**
     * This function filter's the log object according to three scienarios:
     * 1- fromDate and toDate were entered, in this case objects in the range of 
     * fromDate - toDate will be returned.
     * 2- fromDate was only entered, in this case all object
     * greater than or equal to fromDate will be returned.
     * 3- toDate was only entered, in this case all objects
     * less than or equal to toDate will be returned.
     * @param filteredLog the new log after finding logs in the specified date range
     * @param log the original log
     * @param fromDate logs that were created after than or equal to this date
     * @param toDate logs that were created before than or equal to this date
     */
    filterDate: function (filteredLog, log, fromDate, toDate) {
        if (fromDate && toDate) {
            return Promise.each(log, function (item, index, length) {
                const flag = dateHelper.inRange(item.time, fromDate, toDate);
                if (index == length - 1) {
                    return filteredLog;
                }
                if (flag) {
                    filteredLog.push(item);
                }
            })
        }
        else if (fromDate && !toDate) {
            return Promise.each(log, function (item, index, length) {
                const value = dateHelper.compare(item.time, fromDate);
                if (index == length - 1) {
                    return filteredLog;
                }
                // if the time of the item is greater than fromDate
                if (value == 1) {
                    filteredLog.push(item);
                }
                // if the time of the item is equal to fromDate
                else if (value == 0) {
                    filteredLog.push(item);
                }
            })
        }
        else if (!fromDate && toDate) {
            return Promise.each(log, function (item, index, length) {
                const value = dateHelper.compare(toDate, item.time);
                if (index == length - 1) {
                    return filteredLog;
                }
                // if the time of the item is greater than fromDate
                if (value == 1) {
                    filteredLog.push(item);
                }
                // if the time of the item is equal to fromDate
                else if (value == 0) {
                    filteredLog.push(item);
                }
            })
        }
    },

    /**
     * Filters the objects according to the searchEntry.
     * It works like the SQL %like% query. However, it will
     * look for similar values in the following keys of the JSON object:
     * username, role, msg
     * @param log the original log
     * @param searchEntry the search value
     */
    searchLike:function (log, searchEntry) {
        const val = searchEntry.toLowerCase();
        return Promise.filter(log, function (item) {
            return item.username.toLowerCase().indexOf(val) !== -1 ||
            item.role.toLowerCase().indexOf(val) !== -1 ||
            item.msg.toLowerCase().indexOf(val) !== -1 || !val;
        })
    },
    /**
     * Return a paged log.
     * @param log that's going to be paged
     * @param offset the number of rows to skip
     * @param limit the number of rows to retrieve
     * @returns {Array}
     */
    pageLog: function (log, offset, limit) {
        var pagedLog = [];
            if(limit != 0){
                pagedLog = log.slice(offset, offset + limit);
                return pagedLog;
            }
            else if(limit == 0){
                pagedLog = log.slice(offset);
                return pagedLog;
            }
    }

};
