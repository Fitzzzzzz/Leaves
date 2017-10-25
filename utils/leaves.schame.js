let json = {
	request_id: null,
	info: {                             // 请假信息
		kind: "",                         // 类型，可选值为 compensatory(调休) | annual(年假) | personal_affairs(事假)
		from: null,                       // 开始时间
		to: null,                         // 结束时间
		reason: "",                       // 请假原因
		hours: null
	},
	status: "",                         // 请假状态，可选值为
	//   pending | rejected | approved | cancelled
	next: {                             // 下一步审批, 当 status !== 'pending' 时取 {}
		kind: "",                         // 审批类型，可选值为 leader | addition
		operator_employee_id: null        // 审批人id
	},
	histories: [],
	comments: []
};

module.exports = json;
