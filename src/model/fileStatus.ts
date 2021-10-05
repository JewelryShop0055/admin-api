import { DataTypes } from "sequelize";

export const FileStatus = {
  /**
   * 업로드 대기
   */
  pendding: "pendding",
  /**
   * 업로드 완료
   */
  done: "done",
  /**
   * 삭제/삭제 대기
   */
  remove: "remove",
} as const;

export type FileStatusType = typeof FileStatus[keyof typeof FileStatus];

export const FileStatusEnum = DataTypes.ENUM({
  values: ["pendding", "done", "remove"],
});
