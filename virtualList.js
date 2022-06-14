class VirtualList {
    constructor(opt) {
        this.init(opt)
    }
    
    scrollTop = 0;
    // 顶部隐藏数
    topHiddenCount = 0;
    // 底部隐藏数
    bottomHiddenCount = 0;

    init({
        element,
        height,
        rowHeight,
        pageSize,
        renderItem,
        loadMore
    }) {
        // 初始化
        if (typeof element === 'string') {
            this.scroller = document.querySelector(element);
        } else if (element instanceof HTMLElement) {
            this.scroller = element;
        }
        if (!this.scroller) {
            this.throwError('Invalid element');
        }
        if (!height || (typeof height !== 'number' && typeof height !== 'string')) {
            this.throwError('Invalid height value');
        }
        if (typeof rowHeight !== 'number') {
            this.throwError('Invalid rowHeight value');
        }
        if (typeof renderItem !== 'function') {
            this.throwError('renderItem is not a function');
        }
        if (typeof loadMore !== 'function') {
            this.throwError('loadMore is not a function');
        }
        // 设置属性
        this.height = height;
        this.rowHeight = rowHeight;
        this.pageSize = typeof pageSize === 'number' && pageSize > 0 ? pageSize : 50;
        this.renderItem = renderItem;
        this.loadMore = loadMore;
        this.data = [];

        // 创建内容区域
        const contentBox = document.createElement('div');
        this.contentBox = contentBox;
        this.scroller.append(contentBox);

        this.scroller.style.height = typeof height === 'number' ? height + 'px' : height;
        this.scroller.addEventListener('scroll', this.handleScroll);

        this.loadInitData();
    }



    // 滚动事件
    handleScroll = (e) => {
        const {
            clientHeight,
            scrollHeight,
            scrollTop
        } = e.target;
        const distanceToBottom = scrollHeight - (clientHeight + scrollTop);
        if (distanceToBottom < 50) {
            const newData = this.loadMore(this.pageSize);
            this.data.push(...newData);
            this.renderNewData(newData);
        }

        const direction = scrollTop > this.scrollTop ? 1 : -1;
        this.scrollTop = scrollTop;
        this.toggleTopItems(direction);
        this.toggleBottomItems(direction)
    }

    // 处理顶部元素
    toggleTopItems = (direction) => {
        const {
            scrollTop
        } = this.scroller;
        const firstVisibleItemIndex = Math.floor(scrollTop /
            this.rowHeight);

        const rows = this.contentBox.children;
        // 移除超出顶部元素
        if (direction === 1) {
            for (let i = this.topHiddenCount; i < firstVisibleItemIndex; i++) {
                if (rows[0]) rows[0].remove();
            }
        }

        if (direction === -1) {
            for (let i = this.topHiddenCount - 1; i >= firstVisibleItemIndex; i--) {
                const item = this.data[i];
                const row = this.renderRow(item);
                this.contentBox.prepend(row);
            }
        }

        this.topHiddenCount = firstVisibleItemIndex;
        const paddingTop = this.topHiddenCount * this.rowHeight;
        this.contentBox.style.paddingTop = paddingTop + 'px'
    }

    // 处理底部元素
    toggleBottomItems = (direction) => {
        const {
            scrollTop,
            clientHeight
        } = this.scroller;
        const lastVisibleItemIndex = Math.floor((scrollTop + clientHeight) / this.rowHeight);
        const rows = [...this.contentBox.children];
        // if (direction === -1) {
        for (let i = lastVisibleItemIndex + 1; i < this.data.length; i++) {
            const row = rows[i - this.topHiddenCount];
            if (row) row.remove();
        }
        // }

        if (direction === 1) {
            for (let i = this.topHiddenCount + rows.length; i <= lastVisibleItemIndex; i++) {
                const item = this.data[i];
                const row = this.renderRow(item);
                this.contentBox.append(row);
            }
        }

        this.bottomHiddenCount = this.data.length - (this.topHiddenCount + this.contentBox.children.length);
        const paddingBottom = this.bottomHiddenCount * this.rowHeight + 'px';
        this.contentBox.style.paddingBottom = paddingBottom;
    }

    // 插入元素
    renderRow = (item) => {
        const rowContent = this.renderItem(item);
        const row = document.createElement('div');
        row.style.height = this.rowHeight + 'px';
        row.dataset.index = item;
        row.appendChild(rowContent);
        return row;
    }

    // 加载更多
    renderNewData = (newData) => {
        newData.forEach(item => {
            this.contentBox.append(this.renderRow(item));
        })
    }

    // 数据初始化
    loadInitData = () => {
        const newData = this.loadMore(this.pageSize);
        this.data.push(...newData);
        this.renderNewData(newData);
    }

    // 异常
    throwError = (text) => {
        throw new Error(text);
    }
}