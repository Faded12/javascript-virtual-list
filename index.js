const VL = new VirtualList({
    element:'#virtual-list',
    height:'100vh',
    rowHeight:60,
    renderItem:function(item){
        const div = document.createElement('div');
        div.classList.add('row-content');
        div.textContent = item;
        return div;
    },
    loadMore:function(pageSize){
        const data = [];
        for(let i = 0;i<pageSize;i++){
            const item = `第 ${this.data.length + i} 列`
            data.push(item)
        }
        return data;
    }
})