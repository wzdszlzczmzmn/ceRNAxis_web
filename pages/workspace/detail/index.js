import { useRouter } from "next/router";
import Head from "next/head";
import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import { useTaskDetail } from "@/components/features/workspace/hooks/useTaskDetail";
import CustomListQueryDetail from "@/components/features/workspace/components/detail/CustomListQuery/CustomListQueryDetail";
import PairedCohortDetail from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortDetail"

const TASK_DETAIL_COMPONENT_MAP = {
    CustomListQueryTask: CustomListQueryDetail,
    PairedCohortTask: PairedCohortDetail,
};

const TaskDetail = () => {
    const router = useRouter();
    const { taskId } = router.query;

    const taskUUID = Array.isArray(taskId) ? taskId[0] : taskId;

    const {
        task,
        isTaskLoading,
        isTaskError,
    } = useTaskDetail(taskUUID);

    if (!router.isReady || isTaskLoading) {
        return (
            <LoadingView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (!taskUUID) {
        return (
            <EmptyView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
                description="Missing task UUID."
            />
        );
    }

    if (isTaskError) {
        return (
            <ErrorView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (!task) {
        return (
            <EmptyView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
                description="Task not found."
            />
        );
    }

    const DetailComponent = TASK_DETAIL_COMPONENT_MAP[task.task_type];

    return (
        <>
            <Head>
                <title>Workflow Result | ceRNA Axis</title>
            </Head>

            {DetailComponent ? (
                <DetailComponent task={task} />
            ) : (
                <ErrorView
                    containerSx={{
                        height: "80vh",
                        marginTop: "40px",
                    }}
                />
            )}
        </>
    );
};

export default TaskDetail;
