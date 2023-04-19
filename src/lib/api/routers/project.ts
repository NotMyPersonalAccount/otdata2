import prisma from "@/lib/database/prisma";
import { z, TypeOf } from "zod";
import { procedure, router } from "..";
import { ObjectId } from "bson";
import { ProjectTask } from "@prisma/client";
import { CheckinStatus, TaskStatus } from "@/lib/enums/project";

const createProjectSchema = z.object({
	classId: z.string(),
	name: z.string()
});
export type CreateProjectInput = TypeOf<typeof createProjectSchema>;

const deleteProjectScehma = z.object({
	id: z.string()
});
export type DeleteProjectInput = TypeOf<typeof deleteProjectScehma>;

const createOrEditTaskSchema = z.object({
	id: z.string().optional(),
	projectId: z.string(),
	order: z.number(),
	name: z.string(),
	description: z.string(),
	status: z.nativeEnum(TaskStatus)
});
export type CreateOrEditTaskInput = TypeOf<typeof createOrEditTaskSchema>;

const deleteTaskSchema = z.object({
	id: z.string(),
	projectId: z.string()
});
export type DeleteTaskInput = TypeOf<typeof deleteTaskSchema>;


const createOrEditCheckinSchema = z.object({
	id: z.string().optional(),
	projectId: z.string(),
	taskId: z.string(),
	status: z.nativeEnum(CheckinStatus),
	description: z.string()
});
export type CreateOrEditCheckinInput = TypeOf<typeof createOrEditCheckinSchema>;

const deleteCheckinSchema = z.object({
	id: z.string(),
	projectId: z.string()
});
export type DeleteCheckinInput = TypeOf<typeof deleteCheckinSchema>;

export const projectRouter = router({
	create: procedure
		.input(createProjectSchema)
		.mutation(async ({ input, ctx }) => {
			const { classId, name } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const _class = await prisma.googleClassroom.findUnique({
				where: {
					google_classroom_id: classId
				}
			});
			if (!_class) throw new Error("Classroom not found");

			return await prisma.project.create({
				data: {
					name,
					google_classroom_id: _class.id,
					student_id: ctx.session.currUserId
				},
				include: {
					google_classroom: true
				}
			});
		}),
	delete: procedure
		.input(deleteProjectScehma)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const project = await prisma.project.findUnique({
				where: {
					id
				}
			});
			if (!project) throw new Error("Project not found");

			if (
				project.student_id !== ctx.session.currUserId &&
				!ctx.session.admin
			)
				throw new Error("Can not delete project for other user");

			await prisma.project.delete({
				where: {
					id
				}
			});
			return true;
		}),
	createOrEditTask: procedure
		.input(createOrEditTaskSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, projectId, order, name, description, status } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const project = await prisma.project.findUnique({
				where: {
					id: projectId
				}
			});
			if (!project) throw new Error("Project not found");

			const tasks = project.tasks;
			const taskIndex = tasks.findIndex(t => t.id === id);
			let task = tasks[taskIndex];
			if (id && taskIndex === -1) throw new Error("Task not found");

			if (id) {
				task = tasks[taskIndex] = {
					...task,
					name,
					description,
					status,
					complete_date:
						task.complete_date ??
						(status === "Complete" ? new Date() : null)
				};
			} else {
				task =
					tasks[
						(tasks as Partial<ProjectTask>[]).push({
							id: new ObjectId().toString(),
							order: tasks.length + 1,
							name,
							description,
							status
						}) - 1
					];
			}

			const newOrder = Math.max(1, Math.min(tasks.length, order));
			if (task.order !== newOrder) {
				tasks.forEach(t => {
					if (t.id === task.id) return;

					if (t.order >= newOrder && t.order < task.order) t.order++;
					else if (t.order <= newOrder && t.order > task.order)
						t.order--;
				});
				task.order = newOrder;
			}

			tasks
				.sort((a, b) => a.order - b.order)
				.forEach((t, i) => (t.order = i + 1));

			return await prisma.project.update({
				where: {
					id: projectId
				},
				data: {
					tasks: {
						set: tasks
					}
				}
			});
		}),
	deleteTask: procedure
		.input(deleteTaskSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, projectId } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const project = await prisma.project.findUnique({
				where: {
					id: projectId
				}
			});
			if (!project) throw new Error("Project not found");

			const tasks = project.tasks;
			const taskIndex = tasks.findIndex(task => task.id === id);
			if (taskIndex === -1) throw new Error("Task not found");

			tasks.splice(taskIndex, 1);
			tasks
				.sort((a, b) => a.order - b.order)
				.forEach((t, i) => (t.order = i + 1));

			return await prisma.project.update({
				where: {
					id: projectId
				},
				data: {
					tasks: {
						set: tasks
					}
				}
			});
		}),
	createOrEditCheckin: procedure
		.input(createOrEditCheckinSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, projectId, taskId, status, description } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const project = await prisma.project.findUnique({
				where: {
					id: projectId
				}
			});
			if (!project) throw new Error("Project not found");

			const task = project.tasks.find(task => task.id === taskId);
			if (!task) throw new Error("Task not found");

			if (!id) {
				return await prisma.project.update({
					where: {
						id: projectId
					},
					data: {
						checkins: {
							push: [
								{
									id: new ObjectId().toString(),
									working_on_id: taskId,
									working_on_name: task.name,
									status,
									description
								}
							]
						}
					}
				});
			} else {
				return await prisma.project.update({
					where: {
						id: projectId
					},
					data: {
						checkins: {
							updateMany: {
								where: { id },
								data: { status, description }
							}
						}
					}
				});
			}
		}),
	deleteCheckin: procedure
		.input(deleteCheckinSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, projectId } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const project = await prisma.project.findUnique({
				where: {
					id: projectId
				}
			});
			if (!project) throw new Error("Project not found");

			return await prisma.project.update({
				where: {
					id: projectId
				},
				data: {
					checkins: {
						deleteMany: {
							where: { id }
						}
					}
				}
			});
		})
});

