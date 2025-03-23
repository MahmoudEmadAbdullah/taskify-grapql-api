
    class ApiFeatures {
        constructor(mongooseQuery, args) {
            this.mongooseQuery = mongooseQuery;
            this.args = args;
        }

        filter() {
            const queryObj = this.args.filter ? {...this.args.filter} : {...this.args};
            const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword', 'search'];
            excludedFields.forEach((field) => delete queryObj[field]);

            let queryStr = JSON.stringify(queryObj);
            console.log('Query String:', queryStr);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
            console.log('Query Object:', JSON.parse(queryStr));

            this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
            return this;
        }
        
        search(searchFields = {}) {
            const keyword = this.args.search ? this.args.search.keyword : this.args.keyword;
            if (keyword) {
                const searchQuery = {
                    $or: Object.entries(searchFields).map(([field, type]) => {
                        if (type === 'string') {
                            return { [field]: { $regex: keyword, $options: 'i' } };
                        } 
                        else if (type === 'number') {
                            const numValue = parseFloat(keyword);
                            if (!isNaN(numValue)) return { [field]: numValue };
                        } 
                        else if (type === 'boolean') {
                            if (keyword === 'true' || keyword === 'false') {
                                return { [field]: keyword === 'true' };
                            }
                        } 
                        else if (type === 'date') {
                            const dateValue = new Date(keyword);
                            if (!isNaN(dateValue.getTime())) return { [field]: dateValue };
                        }
                        return null;
                    }).filter(Boolean)
                };
                this.mongooseQuery = this.mongooseQuery.find(searchQuery);
            }
            return this;
        }

        sort() {
            if(this.args.sort) {
                const sortBy = this.args.sort.split(',').join(' ');
                this.mongooseQuery = this.mongooseQuery.sort(sortBy);
            } else {
                this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
            }
            return this;
        }

        limitFields() {
            if(this.args.fields) {
                const fields = this.args.fields.split(',').join(' ');
                this.mongooseQuery = this.mongooseQuery.select(fields);
            } else {
                this.mongooseQuery = this.mongooseQuery.select('-__v');
            }
            return this;
        }

        paginate(countDocuments) {
            let page = parseInt(this.args.page, 10) || 1;
            let limit = parseInt(this.args.limit, 10) || 50;

            page = Math.max(1, page);
            limit = Math.min(Math.max(1, limit), 50);

            const skip = (page - 1) * limit;
            const displayedCount = page * limit;

            const pagination = {
                currentPage: page,
                limit,
                count: countDocuments,
                totalPages: Math.ceil(countDocuments / limit),
                nextPage: displayedCount < countDocuments ? page + 1 : null,
                prevPage: skip > 0 ? page - 1 : null
            };

            this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
            this.paginationResult = pagination;
            return this;
        }
    }

    module.exports = ApiFeatures;