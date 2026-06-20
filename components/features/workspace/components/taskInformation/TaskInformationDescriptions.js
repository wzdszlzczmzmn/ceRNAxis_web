import { Descriptions } from "antd";
import { generateTaskInformationItems } from "@/components/features/workspace/components/taskInformation/taskInformationRegistry";

const TaskInformationDescriptions = ({
    taskInformation,
    column = 2,
}) => {
    return (
        <Descriptions
            bordered
            column={column}
            items={generateTaskInformationItems(taskInformation)}
        />
    );
};

export default TaskInformationDescriptions;
